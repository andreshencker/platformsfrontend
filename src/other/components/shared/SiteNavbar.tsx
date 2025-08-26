import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function SiteNavbar() {
    const location = useLocation();

    return (
        <header className="header">
            <div className="container nav">
                {/* Logo y Home */}
                <div className="row">
                    <div
                        className="h-8 w-8 rounded-xl"
                        style={{ background: "var(--yellow)" }}
                    />
                    <strong className="ml-2">
                        <Link to="/" className="link">Binance Dashboard</Link>
                    </strong>
                </div>

                {/* Menú */}
                <nav className="row" style={{ gap: "1.5rem" }}>
                    <Link
                        to="/"
                        className={`link ${location.pathname === "/" ? "active" : ""}`}
                    >
                        Home
                    </Link>

                    <Link
                        to="/register"
                        className={`link ${location.pathname === "/register" ? "active" : ""}`}
                    >
                        Register
                    </Link>

                    <Link
                        to="/login"
                        className={`btn-solid-small ${location.pathname === "/login" ? "active-btn" : ""}`}
                    >
                        Sign in
                    </Link>
                </nav>
            </div>
        </header>
    );
}