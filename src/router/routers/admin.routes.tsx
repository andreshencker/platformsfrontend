import React, { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

// Layout admin
const AdminLayout     = lazy(() => import("@/modules/common/layout/admin/AdminLayout"));
// Páginas admin
const AdminDashboard  = lazy(() => import("@/modules/common/pages/admin/admindashboard"));
const AdminSettings   = lazy(() => import("@/modules/common/pages/admin/adminsettings"));
// Users (lista/gestión)
const AdminUsers      = lazy(() => import("@/modules/users/pages/admin/UsersListPage"));
const ProfileUsers      = lazy(() => import("@/modules/users/pages/admin/ProfilePage"));
// Utilidades
const NotFound        = lazy(() => import("@/modules/common/pages/not-found"));

/** Árbol de rutas para usuarios con rol admin */
export const adminRoutes: RouteObject[] = [
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            // /admin -> redirige a /admin/dashboard
            { index: true, element: <Navigate to="dashboard" replace /> },
            { path: "dashboard", element: <AdminDashboard /> },
            { path: "settings", element: <AdminSettings /> },
            { path: "users", element: <AdminUsers /> },
            { path: "users", element: <ProfileUsers /> },
            { path: "*", element: <NotFound /> },
        ],
    },
];