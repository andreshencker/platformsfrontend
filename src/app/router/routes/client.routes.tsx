// src/router/routes/client.routes.tsx
import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import ClientLayout from "@/app/common/layout/client/ClientLayout";

const ClientDashboard = lazy(() => import("@/app/common/pages/client/clientdashboard"));
const ClientSettings  = lazy(() => import("@/app/common/pages/client/clientsettings"));
const Onboarding      = lazy(() => import("@/modules/integrations/onboard/pages/Onboarding"));

export const clientRoutes = [
    // ONBOARDING fuera del layout:
    {
        path: "/client/onboarding",
        element: <Onboarding />, // <- no hay ClientLayout aquí
    },

    // Resto de rutas con layout:
    {
        path: "/client",
        element: <ClientLayout />,
        children: [
            { index: true, element: <Navigate to="dashboard" replace /> },
            { path: "dashboard", element: <ClientDashboard /> },
            { path: "settings",  element: <ClientSettings  /> },
        ],
    },
];