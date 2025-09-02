// src/app/router/routes/client.routes.tsx
import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import ClientLayout from "@/app/common/layout/client/ClientLayout";
const ClientSettings  = lazy(() => import("@/app/common/pages/client/clientsettings"));
const Onboarding      = lazy(() => import("@/modules/integrations/onboard/pages/Onboarding"));
const BinanceDashboard = lazy(() => import("@/modules/integrations/binance/pages/client/BinanceDashboard"));
const BinanceSpot      = lazy(() => import("@/modules/integrations/binance/pages/client/BinanceSpot"));
const BinanceFutures   = lazy(() => import("@/modules/integrations/binance/pages/client/BinanceFutures"));
const BinanceMargin    = lazy(() => import("@/modules/integrations/binance/pages/client/BinanceMargin"));
const ClientProfile  = lazy(() => import("@/modules/users/pages/client/ProfilePage"));

export const clientRoutes = [
    { path: "/client/onboarding", element: <Onboarding /> },
    {
        path: "/client",
        element: <ClientLayout />,
        children: [
            // Binance
            { path: "binance", element: <Navigate to="binance/dashboard" replace /> },
            { path: "binance/dashboard", element: <BinanceDashboard /> },
            { path: "binance/spot",      element: <BinanceSpot /> },
            { path: "binance/futures",   element: <BinanceFutures /> },
            { path: "binance/margin",    element: <BinanceMargin /> },
            { path: "settings", element: <ClientSettings /> },
            { path: "settings/profile", element: <ClientProfile /> },

            // ⬇️ fallback para rutas no encontradas en /client
            { path: "*", element: <Navigate to="/client/binance/dashboard" replace /> },
        ],
    },
];