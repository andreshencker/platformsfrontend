// src/context/client/components/ClientNavbar.tsx
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/useAuth";

export default function ClientNavbar() {
    const { logout } = useAuth();

    return (
        <header className="header">
            <div className="container nav">
                <Link to="/dashboard" className="row" aria-label="Home">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <circle cx="12" cy="12" r="10" fill="#ffd400"/>
                        <path d="M8.5 12.5h7M12 9v7" stroke="#111119" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                    <strong style={{ fontSize: 16 }}>Client Panel</strong>
                </Link>

                <nav className="row" style={{ gap: 18 }}>
                    <NavLink to="/dashboard" className="btn btn-outline" style={{ padding: "10px 16px", borderRadius: 999 }}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/trades" className="btn btn-outline" style={{ padding: "10px 16px", borderRadius: 999 }}>
                        Trades
                    </NavLink>
                    <NavLink to="/settings" className="btn btn-outline" style={{ padding: "10px 16px", borderRadius: 999 }}>
                        Settings
                    </NavLink>
                    <button className="btn btn-primary" onClick={logout}>Log out</button>
                </nav>
            </div>
        </header>
    );
}