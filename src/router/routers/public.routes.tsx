import React, { lazy } from "react";
import type { RouteObject } from "react-router-dom";

// Layout público
const PublicLayout  = lazy(() => import("@/modules/common/layout/public/PublicLayout"));
// Páginas públicas
const HomePage      = lazy(() => import("@/modules/common/pages/home"));
const LoginPage     = lazy(() => import("@/modules/auth/pages/login"));
const RegisterPage  = lazy(() => import("@/modules/auth/pages/register"));
const NotFound      = lazy(() => import("@/modules/common/pages/not-found"));
const Unauthorized  = lazy(() => import("@/modules/common/pages/unauthorized"));

/** Árbol de rutas para visitantes/no autenticados */
export const publicRoutes: RouteObject[] = [
    {
        path: "/",
        element: <PublicLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
            { path: "unauthorized", element: <Unauthorized /> },
            { path: "not-found", element: <NotFound /> },
            // atrapar cualquier otra URL pública
            { path: "*", element: <NotFound /> },
        ],
    },
];