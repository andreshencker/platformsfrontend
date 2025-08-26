import React from "react";
import ReactDOM from "react-dom/client";
import Providers from "@/app/Providers";
import AppRouter from "@/router";
import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Providers>
            <AppRouter />
        </Providers>
    </React.StrictMode>
);