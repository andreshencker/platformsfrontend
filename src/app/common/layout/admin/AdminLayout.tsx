import { Outlet } from "react-router-dom";
import AdminNavbar from "./components/AdminNavbar";

export default function AdminLayout() {
    return (
        <div className="min-h-screen" style={{ background: "var(--bg)" }}>
            <AdminNavbar />

            <main className="container" style={{ padding: "32px 0 56px" }}>
                <Outlet />
            </main>
        </div>
    );
}