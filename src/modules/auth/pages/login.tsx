import React from "react";
import LoginForm from "@/modules/auth/components/LoginForm";

export default function LoginPage() {
    return (
        <section className="section container">
            <div className="auth-grid">
                {/* Lado izquierdo: copy/beneficios */}
                <div>
                    <div className="badge" style={{ marginBottom: 12 }}>Premium • Secure • Fast</div>
                    <h1 className="h1">Sign in</h1>
                    <p className="lead" style={{ maxWidth: 560 }}>
                        Access powerful visual metrics with a clean, confidence-inspiring interface.
                    </p>

                    <div className="spacer" />

                    {/* Pequeñas “features” para dar contexto y mantener el layout */}
                    <div className="kpis">
                        <div className="kpi">
                            <div className="big">4.9★</div>
                            <div className="sub">App Rating</div>
                        </div>
                        <div className="kpi">
                            <div className="big">$2.4B+</div>
                            <div className="sub">Total Volume</div>
                        </div>
                        <div className="kpi">
                            <div className="big">120k</div>
                            <div className="sub">Users</div>
                        </div>
                        <div className="kpi">
                            <div className="big">&lt;120ms</div>
                            <div className="sub">Latency</div>
                        </div>
                    </div>
                </div>

                {/* Lado derecho: formulario */}
                <LoginForm />
            </div>
        </section>
    );
}