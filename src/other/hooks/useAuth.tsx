import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import http, { setAuthToken, clearAuthToken } from "@/lib/http";
import type { RegisterDTO } from "@/other/types/register";
import type { LoginDTO } from "@/other/types/login";
import type { User } from "@/other/types/user";

type AuthContextValue = {
    user: User | null;
    token: string | null;
    loading: boolean;
    registerUser: (dto: RegisterDTO) => Promise<void>;
    login: (dto: LoginDTO) => Promise<void>;
    logout: () => void;
};

// ---- Context
const Ctx = createContext<AuthContextValue | undefined>(undefined);

// ---- Helpers
const STORAGE_KEY = "auth_token";

async function fetchMe(): Promise<User> {
    const { data } = await http.get<User>("/auth/me");
    return data;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Bootstrap desde localStorage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setAuthToken(saved);
            setToken(saved);
            fetchMe()
                .then(setUser)
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const registerUser = async (dto: RegisterDTO) => {
        setLoading(true);
        try {
            // tu backend devuelve { access_token }
            const { data } = await http.post<{ access_token: string }>("/auth/register", dto);
            localStorage.setItem(STORAGE_KEY, data.access_token);
            setAuthToken(data.access_token);
            setToken(data.access_token);

            // Cargar perfil
            const me = await fetchMe();
            setUser(me);
        } finally {
            setLoading(false);
        }
    };

    const login = async (dto: LoginDTO) => {
        setLoading(true);
        try {
            const { data } = await http.post<{ access_token: string }>("/auth/login", dto);
            localStorage.setItem(STORAGE_KEY, data.access_token);
            setAuthToken(data.access_token);
            setToken(data.access_token);

            const me = await fetchMe();
            setUser(me);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEY);
        clearAuthToken();
        setToken(null);
        setUser(null);
    };

    const value = useMemo(
        () => ({ user, token, loading, registerUser, login, logout }),
        [user, token, loading]
    );

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}