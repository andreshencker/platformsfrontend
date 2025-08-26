import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import {
    login as apiLogin,
    register as apiRegister,
    me as apiMe,
    clearSession,
} from "../api/auth";
import type { AuthUser, LoginDto, RegisterDto, UserRole } from "../types/auth";
import { getAuthToken } from "@/lib/storage";
import { ROUTES } from "@/lib/constants";

type AuthState = {
    user: AuthUser | null;
    loading: boolean;
    ready: boolean;
};

type AuthContextValue = AuthState & {
    login: (dto: LoginDto) => Promise<void>;
    register: (dto: RegisterDto) => Promise<void>;
    logout: () => void;
    hasRole: (roles: UserRole[]) => boolean;
    refreshMe: () => Promise<void>;
};

const Ctx = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(false);
    const [ready, setReady] = useState(false);

    const nav = useNavigate();
    const loc = useLocation();
    const qc = useQueryClient();

    const bootstrap = useCallback(async () => {
        const token = getAuthToken();
        if (!token) {
            setReady(true);
            return;
        }
        try {
            setLoading(true);
            const u = await apiMe();
            setUser(u);
        } catch {
            clearSession();
            setUser(null);
        } finally {
            setLoading(false);
            setReady(true);
        }
    }, []);

    useEffect(() => {
        void bootstrap();
    }, [bootstrap]);

    /** Redirección por rol (para LOGIN) */
    const redirectByRole = useCallback(
        (role: UserRole) => {
            if (role === "admin") {
                nav(ROUTES.adminDashboard, { replace: true });
            } else {
                nav(ROUTES.clientDashboard, { replace: true });
            }
        },
        [nav]
    );

    /** LOGIN: va por rol normal */
    const login = useCallback(
        async (dto: LoginDto) => {
            setLoading(true);
            try {
                const res = await apiLogin(dto); // { user, access_token }
                setUser(res.user);
                qc.clear();
                redirectByRole(res.user.role);
            } finally {
                setLoading(false);
            }
        },
        [qc, redirectByRole]
    );

    /** REGISTER: si es client, SIEMPRE va al onboarding */
    const register = useCallback(
        async (dto: RegisterDto) => {
            setLoading(true);
            try {
                const res = await apiRegister(dto); // { user, access_token }
                setUser(res.user);
                qc.clear();

                if (res.user.role === "admin") {
                    // Admin no hace onboarding
                    nav(ROUTES.adminDashboard, { replace: true });
                } else {
                    // Client -> onboarding SIEMPRE tras registro
                    nav(ROUTES.Onboarding, { replace: true });
                }
            } finally {
                setLoading(false);
            }
        },
        [qc, nav]
    );

    const logout = useCallback(() => {
        clearSession();
        setUser(null);
        qc.clear();
        const from =
            loc.pathname.startsWith("/admin") || loc.pathname.startsWith("/client")
                ? ROUTES.login
                : loc.pathname;
        nav(from, { replace: true });
    }, [qc, nav, loc.pathname]);

    const hasRole = useCallback(
        (roles: UserRole[]) => {
            if (!user) return false;
            return roles.includes(user.role);
        },
        [user]
    );

    const refreshMe = useCallback(async () => {
        const u = await apiMe();
        setUser(u);
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            loading,
            ready,
            login,
            register,
            logout,
            hasRole,
            refreshMe,
        }),
        [user, loading, ready, login, register, logout, hasRole, refreshMe]
    );

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
    return ctx;
}