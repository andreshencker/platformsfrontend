import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "@/other/components/form/LoginForm";

export default function Login() {
    return (
        <div className="min-h-screen bg-dark accent-rows">
            <header className="header">
                <div className="container nav">
                    <div className="row">
                        <div className="h-8 w-8 rounded-xl" style={{ background: "var(--yellow)" }} />
                        <strong>Binance Dashboard</strong>
                    </div>
                    <div className="row" style={{ color: "var(--muted)" }}>
                        <a className="link" href="#">Features</a>
                        <a className="link" href="#">Docs</a>
                    </div>
                </div>
            </header>

            <main className="container section" style={{ maxWidth: 520 }}>
                <LoginForm />

            </main>
        </div>
    );
}