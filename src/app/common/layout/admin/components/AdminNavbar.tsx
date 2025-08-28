// src/app/common/layout/admin/AdminNavbar.tsx
import { NavLink } from "react-router-dom";
import { ThemeSwitcher } from "@/app/common/theme/ThemeSwitcher";

const linkClass = ({ isActive }: { isActive: boolean }) =>
    `link${isActive ? " active" : ""}`;

export default function AdminNavbar() {
    return (
        <header className="header">
            <div className="container nav">
                {/* Left: brand */}
                <div className="row" style={{ gap: 10 }}>
                    <div
                        className="h-8 w-8 rounded-xl"
                        style={{ background: "var(--color-warning, #F0B90B)" }}
                        aria-hidden
                    />
                    <strong>Administration</strong>
                </div>

                {/* Right: links + theme */}
                <div className="row" style={{ gap: 16, color: "var(--muted)" }}>
                    <nav className="row" style={{ gap: 12 }}>
                        <NavLink to="/admin/dashboard" className={linkClass}>
                            Dashboard
                        </NavLink>
                        <NavLink to="/admin/settings" className={linkClass}>
                            Settings
                        </NavLink>
                    </nav>

                    {/* Toggle light/dark */}
                    <ThemeSwitcher />
                </div>
            </div>
        </header>
    );
}