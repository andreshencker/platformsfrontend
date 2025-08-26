import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/useAuth";

/**
 * Protege rutas privadas.
 * - Mientras `ready`/`loading` => muestra un loader (no decide).
 * - Si `ready` y NO hay user => va a /login.
 * - Si hay user => renderiza hijos.
 */
export default function PrivateRoute() {
    const { user, loading, ready } = useAuth();

    if (!ready || loading) {
        return (
            <div style={{ padding: 24, display: "grid", placeItems: "center" }}>
                <div className="spinner" aria-label="Cargando…" />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    return <Outlet />;
}