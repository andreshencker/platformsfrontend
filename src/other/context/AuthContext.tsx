// src/context/AuthContext.tsx
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { AuthUser, login as apiLogin, register as apiRegister, logout as apiLogout, me as apiMe } from "@/other/api/auth";
import { TOKEN_KEY } from "@/other/api/client";

type AuthState = {
    user: AuthUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (payload: {
        email: string;
        password: string;
        firstName?: string;
        middleName?: string;
        lastName?: string;
        secondLastName?: string;
    }) => Promise<void>;
    refresh: () => Promise<void>;
    logout: () => void;
};

export const AuthContext = createContext<AuthState>({
    user: null,
    loading: true,
    login: async () => {},
    register: async () => {},
    refresh: async () => {},
    logout: () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            const hasToken = !!localStorage.getItem(TOKEN_KEY);
            if (!hasToken) {
                setUser(null);
                return;
            }
            const me = await apiMe();
            setUser(me);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // cargar sesión al iniciar
        refresh();
    }, [refresh]);

    const login = useCallback(async (email: string, password: string) => {
        const { user } = await apiLogin({ email, password });
        setUser(user);
    }, []);

    const register = useCallback(
        async (payload: {
            email: string;
            password: string;
            firstName?: string;
            middleName?: string;
            lastName?: string;
            secondLastName?: string;
        }) => {
            const { user } = await apiRegister(payload);
            setUser(user);
        },
        []
    );

    const logout = useCallback(() => {
        apiLogout();
        setUser(null);
    }, []);

    const value = useMemo(
        () => ({ user, loading, login, register, refresh, logout }),
        [user, loading, login, register, refresh, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};