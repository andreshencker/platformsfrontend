import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    ReactNode,
} from "react";
import toast from "react-hot-toast";
import { api, setAuthHeader, clearAuthHeader } from "@/app/lib/http";
import {
    getToken as loadToken,
    setToken as saveToken,
    clearToken,
    getUser as loadUser,
    setUser as saveUser,
    clearUser,
} from "@/app/lib/storage";
import type { StoredUser } from "@/app/lib/storage";

/** ===== Tipos expuestos por el contexto (User se alinea con lo guardado en storage) ===== */
type User = StoredUser;

type AuthContextValue = {
    user: User;
    token: string | null;
    isAuthenticated: boolean;

    loading: boolean; // acción en curso (login/register/logout)
    ready: boolean;   // bootstrap inicial completado

    // acciones
    login: (email: string, password: string) => Promise<void>;
    register: (payload: Record<string, any>) => Promise<void>;
    logout: () => Promise<void>;

    // utilidades
    refreshMe: () => Promise<void>;
    setUser: (u: User) => void;
    setToken: (t: string | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** ===== Provider ===== */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUserState] = useState<User>(null);
    const [tokenState, setTokenState] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [ready, setReady] = useState(false);

    const isAuthenticated = !!tokenState;

    /** ---- helpers de sesión (sin acoplar navegación) ---- */
    const applyToken = useCallback((t: string | null) => {
        setTokenState(t);
        setAuthHeader(t);
        if (t) saveToken(t);
        else clearToken();
    }, []);

    const applyUser = useCallback((u: User) => {
        setUserState(u);
        saveUser(u);
    }, []);

    const clearSession = useCallback(() => {
        setUserState(null);
        setTokenState(null);
        clearAuthHeader(); // ← quitar Authorization global de axios
        clearUser();
        clearToken();
    }, []);

    /** ---- bootstrap al montar (carga token+user y refresca /me si existe) ---- */
    useEffect(() => {
        (async () => {
            try {
                const storedToken = loadToken();
                const storedUser = loadUser<User>();

                if (storedToken) {
                    applyToken(storedToken);
                    // pintar user almacenado de forma optimista mientras se consulta /me
                    setUserState(storedUser ?? null);

                    try {
                        const r = await api.get("/auth/me");
                        const me: User = r?.data?.user ?? r?.data ?? null;
                        if (me) applyUser(me);
                    } catch {
                        // si /me falla, invalidamos la sesión
                        clearSession();
                    }
                } else {
                    clearSession();
                }
            } finally {
                setReady(true);
            }
        })();
    }, [applyToken, applyUser, clearSession]);

    /** ---- acciones ---- */
    const login = useCallback(
        async (email: string, password: string) => {
            setLoading(true);
            try {
                const { data } = await api.post("/auth/login", { email, password });

                // soporta distintas claves que pueda devolver tu backend
                const accessToken: string =
                    data?.access_token ?? data?.accessToken ?? data?.token;

                const me: User = data?.user ?? null;
                if (!accessToken || !me) {
                    throw new Error("Invalid login response");
                }

                applyToken(accessToken);
                applyUser(me);
                toast.success("Welcome!");
                // la navegación se resuelve fuera (AppContext/AppRouter).
            } catch (e: any) {
                const msg =
                    e?.response?.data?.message || e?.message || "Could not sign in";
                toast.error(msg);
                throw e;
            } finally {
                setLoading(false);
                setReady(true);
            }
        },
        [applyToken, applyUser]
    );

    const register = useCallback(
        async (payload: Record<string, any>) => {
            setLoading(true);
            try {
                const { data } = await api.post("/auth/register", payload);

                const accessToken: string =
                    data?.access_token ?? data?.accessToken ?? data?.token;

                const me: User = data?.user ?? null;
                if (!accessToken || !me) {
                    throw new Error("Invalid register response");
                }

                applyToken(accessToken);
                applyUser(me);
                toast.success("Account created. Welcome!");
            } catch (e: any) {
                const msg =
                    e?.response?.data?.message || e?.message || "Could not register";
                toast.error(msg);
                throw e;
            } finally {
                setLoading(false);
                setReady(true);
            }
        },
        [applyToken, applyUser]
    );

    const logout = useCallback(async () => {
        setLoading(true);
        try {
            // opcional: await api.post("/auth/logout").catch(() => {});
            clearSession();
            toast.success("Signed out");
        } finally {
            setLoading(false);
            setReady(true);
        }
    }, [clearSession]);

    const refreshMe = useCallback(async () => {
        const t = loadToken();
        if (!t) return;
        try {
            const r = await api.get("/auth/me");
            const me: User = r?.data?.user ?? r?.data ?? null;
            if (me) applyUser(me);
        } catch {
            clearSession();
        }
    }, [applyUser, clearSession]);

    /** ---- setters públicos (por si los necesitas) ---- */
    const setUserPublic = useCallback((u: User) => applyUser(u), [applyUser]);
    const setTokenPublic = useCallback(
        (t: string | null) => applyToken(t),
        [applyToken]
    );

    /** ---- value del contexto ---- */
    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            token: tokenState,
            isAuthenticated,
            loading,
            ready,
            login,
            register,
            logout,
            refreshMe,
            setUser: setUserPublic,
            setToken: setTokenPublic,
        }),
        [
            user,
            tokenState,
            isAuthenticated,
            loading,
            ready,
            login,
            register,
            logout,
            refreshMe,
            setUserPublic,
            setTokenPublic,
        ]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** ===== Hook de consumo ===== */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
    return ctx;
}