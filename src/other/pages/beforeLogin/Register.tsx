import React from "react";
import { Link } from "react-router-dom";
import RegisterForm from "@/other/components/form/RegisterForm";

export default function Register() {
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

            <main className="container section auth-grid">
                <section>
                    <h1 className="h1">Create your account</h1>
                    <p className="lead mt-3 max-w-[60ch]">
                        Analyze your performance with a fast, thoughtful interface. Reports, export, and real-time data included.
                    </p>
                    {/* KPIs / features como ya tenías… */}
                </section>

                <section>
                    <div className="auth-card">
                        <div className="row"><span className="badge badge-yellow">SIGN UP</span></div>
                        <h2 className="h2 mt-3">Create account</h2>
                        <p className="muted">Fill your details to get started.</p>
                        <RegisterForm />
                        <div className="center lead mt-2">Already have an account? <Link className="link" to="/login">Sign in</Link></div>
                    </div>
                </section>
            </main>
        </div>
    );
}