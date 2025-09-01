import React, { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

// Layout admin
const AdminLayout     = lazy(() => import("@/app/common/layout/admin/AdminLayout"));
// Páginas admin
const AdminDashboard  = lazy(() => import("@/app/common/pages/admin/admindashboard"));
const AdminSettings   = lazy(() => import("@/app/common/pages/admin/adminsettings"));
// Users (lista/gestión)
const AdminUsers      = lazy(() => import("@/modules/users/pages/admin/UsersManagerPage"));
const ProfileUsers      = lazy(() => import("@/modules/users/pages/admin/ProfilePage"));
// Utilidades
const NotFound        = lazy(() => import("@/app/common/pages/not-found"));

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
            { path: "userProfile", element: <ProfileUsers /> },
            { path: "*", element: <NotFound /> },
        ],
    },
];