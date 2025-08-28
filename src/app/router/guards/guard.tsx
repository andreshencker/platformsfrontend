export { default as PrivateRoute } from "./PrivateRoute";
export { default as RoleRoute } from "./RoleRoute";
export { default as RoleRedirect } from "./RoleRedirect";

// GuestRoute suelto aquí:
import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import RoleRedirect from "./RoleRedirect";

export function GuestRoute() {
    const { ready, user } = useAuth();

    if (!ready) return <div className="container" style={{ padding: 20 }}>Loading…</div>;
    if (user)     return <RoleRedirect />;

    return <Outlet />;
}