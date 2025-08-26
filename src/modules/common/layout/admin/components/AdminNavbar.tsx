import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) =>
    `link${isActive ? " active" : ""}`;

export default function AdminNavbar() {
    return (
        <header className="header">
            <div className="container nav">
                {/* Left: logo + brand */}
                <div className="row">
                    <div
                        className="h-8 w-8 rounded-xl"
                        style={{ background: "var(--yellow)" }}
                        aria-hidden
                    />
                    <strong>Administration</strong>
                </div>

                {/* Right: admin links */}
                <nav className="row" style={{ color: "var(--muted)" }}>
                    <NavLink to="/admin/dashboard" className={linkClass}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/admin/settings" className={linkClass}>
                        Settings
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}