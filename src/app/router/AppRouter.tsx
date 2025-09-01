import React, { Suspense, useEffect } from "react";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";

import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useApp } from "@/app/context/AppContext";

import { publicRoutes } from "@/app/router/public.routes";
import { clientRoutes } from "@/app/router/client.routes";
import { adminRoutes } from "@/app/router/admin.routes";

import { resolveLanding } from "@/app/router/resolve";

/** Loader simple mientras se resuelven flags */
function Loader() {
    return <div style={{ padding: 24 }}>Loading…</div>;
}

export default function AppRouter() {
    const { user, ready: authReady, isAuthenticated } = useAuth();
    const app = useApp();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const routesElement = useRoutes([
        ...publicRoutes,
        ...clientRoutes,
        ...adminRoutes,
    ]);

    // Redirección post-login / root -> landing
    useEffect(() => {
        if (!authReady) return;

        // Usuario no autenticado: no forzamos nada, dejamos ver rutas públicas
        if (!isAuthenticated) return;

        // Usuario autenticado: si estás en "/" o en "/login" te mando al landing.
        // Si tu landing depende de la plataforma (app), espera a que app.ready esté listo.
        const isRootOrLogin = pathname === "/" || pathname.startsWith("/login");

        if (isRootOrLogin) {
            // Si tu lógica de resolve depende del app context, requiere app.ready
            if (!app.ready) return;

            const to = resolveLanding({ user, app }); // debe devolver string
            if (to && to !== pathname) {
                navigate(to, { replace: true });
            }
        }
    }, [authReady, isAuthenticated, app.ready, user, app, pathname, navigate]);

    // 1) Mientras no esté listo auth, muestra loader
    if (!authReady) return <Loader />;

    // 2) Si NO está autenticado → no bloquees por app.ready (rutas públicas deben renderizar)
    if (!isAuthenticated) {
        return <Suspense fallback={<Loader />}>{routesElement}</Suspense>;
    }

    // 3) Si SÍ está autenticado → ahora sí exige app.ready
    if (!app.ready) return <Loader />;

    return <Suspense fallback={<Loader />}>{routesElement}</Suspense>;
}