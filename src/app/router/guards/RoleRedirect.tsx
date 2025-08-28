import React, { useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/useAuth";

export default function RoleRedirect({ replace = true }: { replace?: boolean }) {
    const { ready, user } = useAuth();

    if (!ready) return <div className="container" style={{ padding: 20 }}>Loading…</div>;
    if (!user)  return <Navigate to="/login" replace={replace} />;

    const to = useMemo(
        () => (user.role === "admin" ? "/admin/dashboard" : "/client/dashboard"),
        [user.role]
    );

    return <Navigate to={to} replace={replace} />;
}