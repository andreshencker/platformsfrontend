import React from "react";

export default function SiteFooter() {
    return (
        <footer className="footer">
            <div className="container row" style={{ justifyContent: "space-between", color: "var(--muted)" }}>
                <div>© {new Date().getFullYear()} Binance Dashboard</div>
                <nav className="row">
                    <a className="link" href="#">Privacy</a>
                    <a className="link" href="#">Terms</a>
                    <a className="link" href="#">Contact</a>
                </nav>
            </div>
        </footer>
    );
}