// src/app/AppRouter.tsx
import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router/index";

export default function AppRouter() {
    return <RouterProvider router={router} />;
}