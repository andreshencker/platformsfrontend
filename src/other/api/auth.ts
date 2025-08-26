import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
};

type AuthContextValue = {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user?: User) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "auth_token";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    // Cargar token al inicio
    useEffect(() => {
        const t = localStorage.getItem(TOKEN_KEY);
        if (t) setToken(t);
    }, []);

    const login = (t: string, u?: User) => {
        localStorage.setItem(TOKEN_KEY, t);
        setToken(t);
        if (u) setUser(u);
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
    };

    const value = useMemo(
        () => ({
            user,
            token,
            isAuthenticated: !!token,
            login,
            logout,
        }),
        [user, token]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}