import React from "react";
import { Outlet } from "react-router-dom";
import ClientNavbar from "./components/ClientNavbar";
import ClientSidebar from "./components/ClientSidebar";

export default function ClientLayout() {
    return (
        <div className="min-h-screen bg-dark text-[#e6e6e6]">
            <ClientNavbar />
            <div className="container" style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16, padding: 16 }}>
                <ClientSidebar />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}