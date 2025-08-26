import React, { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { publicRoutes } from "./public.routes";
import { adminRoutes } from "./admin.routes";
import { clientRoutes } from "./client.routes";

const NotFound = lazy(() => import("@/modules/common/pages/not-found"));
const Unauthorized = lazy(() => import("@/modules/common/pages/unauthorized"));

export const routes: RouteObject[] = [
    ...publicRoutes,
    ...adminRoutes,
    ...clientRoutes,
    { path: "/unauthorized", element: <Unauthorized /> },
    { path: "*", element: <NotFound /> },
];