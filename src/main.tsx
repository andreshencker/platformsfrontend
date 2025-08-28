import React from "react";
import ReactDOM from "react-dom/client";
import Providers from "@/app/providers/Providers";
import AppRouter from "@/app/router";
import "@/app/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Providers>
            <AppRouter />
        </Providers>
    </React.StrictMode>
);