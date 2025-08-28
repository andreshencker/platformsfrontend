import React, { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/useAuth";

// Grupos de rutas
import { publicRoutes } from "@/app/router/routes/public.routes";
import { clientRoutes } from "@/app/router/routes/client.routes";
import { adminRoutes } from "@/app/router/routes/admin.routes";

// Un pequeño loader para el lazy
function Loader() {
    return <div className="container" style={{ padding: 32 }}>Loading…</div>;
}

export default function AppRouter() {
    const { user, ready } = useAuth();

    // Mientras bootstrap (useAuth) determina si hay sesión…
    if (!ready) return <Loader />;

    // Elige el árbol de rutas según el rol
    const routes =
        user?.role === "admin"
            ? adminRoutes
            : user?.role === "client"
                ? clientRoutes
                : publicRoutes;

    // Renderiza el árbol elegido
    const element = useRoutes(routes);
    return <Suspense fallback={<Loader />}>{element}</Suspense>;
}