import { Link, NavLink } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) =>
    `link${isActive ? " active" : ""}`;

export default function PublicNavbar() {
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
                    <strong>Binance Dashboard</strong>
                </div>

                {/* Right: public links */}
                <nav className="row" style={{ color: "var(--muted)" }}>
                    <NavLink to="/" end className={linkClass}>
                        Home
                    </NavLink>
                    <NavLink to="/login" className={linkClass}>
                        Login
                    </NavLink>
                    <NavLink to="/register" className={linkClass}>
                        sign up
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}
