// src/modules/common/layout/public/PublicLayout.tsx
import { Outlet } from "react-router-dom";
import PublicNavbar from "./components/PublicNavbar";
import PublicFooter from "./components/PublicFooter";

export default function PublicLayout() {
    return (
        <div className="layout">
            <PublicNavbar />
            <main className="content">
                <Outlet /> {/* 👈 Aquí se renderizan Login, Register, Home, etc. */}
            </main>
            <PublicFooter />
        </div>
    );
}