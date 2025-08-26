// src/app/AppRouter.tsx
import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router";

export default function AppRouter() {
    return <RouterProvider router={router} />;
}