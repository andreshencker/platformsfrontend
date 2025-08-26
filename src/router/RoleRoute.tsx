import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/useAuth";

type Props = { allow: Array<"admin" | "client"> };

export default function RoleRoute({ allow }: Props) {
    const { user, loading, ready } = useAuth();

    if (!ready || loading) {
        return (
            <div style={{ padding: 24, display: "grid", placeItems: "center" }}>
                <div className="spinner" aria-label="Cargando…" />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    if (!allow.includes(user.role)) {
        // si no cumple rol: puedes mandar a /unauthorized o al dashboard correspondiente.
        const fallback = user.role === "admin" ? "/admin/dashboard" : "/client/dashboard";
        return <Navigate to={fallback} replace />;
    }

    return <Outlet />;
}