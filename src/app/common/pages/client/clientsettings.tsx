import React from "react";
import { Link } from "react-router-dom";

export default function Clientsettings() {
    return (
        <main className="container section">
            <h1 className="h1">Settings</h1>
            <p className="muted" style={{ marginTop: 8 }}>
                Parámetros de conexión del frontend (solo lectura).
            </p>

            {/* Tarjeta de API */}
            <section
                style={{
                    marginTop: 20,
                    background: "var(--panel, #0f0f16)",
                    border: "1px solid var(--border, #20202a)",
                    borderRadius: 16,
                    padding: 20,
                }}
            >
                <div
                    className="row"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 16,
                    }}
                >
                    <Field label="API Base" value="http://localhost:3000" />
                    <Field label="API Key (x-api-key)" value="********" />
                </div>

                <div className="row" style={{ marginTop: 20 }}>
                    <a
                        href="http://localhost:3000/api"
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary"
                    >
                        Abrir Swagger
                    </a>
                </div>
            </section>

            {/* NUEVA sección de perfil */}
            <section
                style={{
                    marginTop: 20,
                    background: "var(--panel, #0f0f16)",
                    border: "1px solid var(--border, #20202a)",
                    borderRadius: 16,
                    padding: 20,
                }}
            >
                <div
                    className="row"
                    style={{
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontSize: 14,
                                color: "var(--muted, #8b8b99)",
                                letterSpacing: 0.2,
                            }}
                        >
                            Profile
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>
                            User information
                        </div>
                        <div
                            style={{
                                fontSize: 13,
                                color: "var(--muted, #8b8b99)",
                                marginTop: 4,
                            }}
                        >
                            See and manage your account details (name, email).
                        </div>
                    </div>

                    <Link to="/profile" className="btn btn-primary">
                        View profile
                    </Link>
                </div>
            </section>

            <section
                style={{
                    marginTop: 20,
                    background: "var(--panel, #0f0f16)",
                    border: "1px solid var(--border, #20202a)",
                    borderRadius: 16,
                    padding: 20,
                }}
            >
                <div
                    className="row"
                    style={{
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontSize: 14,
                                color: "var(--muted, #8b8b99)",
                                letterSpacing: 0.2,
                            }}
                        >
                            Integrations
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>
                            Platforms & API Keys
                        </div>
                        <div
                            style={{
                                fontSize: 13,
                                color: "var(--muted, #8b8b99)",
                                marginTop: 4,
                            }}
                        >
                            Manage and link your trading/data platforms. Add API keys
                            for Binance, Interactive Brokers, and more.
                        </div>
                    </div>

                    <Link to="/settings/integrations" className="btn btn-primary">
                        Manage API
                    </Link>
                </div>
            </section>


        </main>
    );
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div
                style={{
                    fontSize: 12,
                    color: "var(--muted, #8b8b99)",
                    marginBottom: 6,
                }}
            >
                {label}
            </div>
            <div
                style={{
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: "var(--inputBg, #0b0b0e)",
                    border: "1px solid var(--border, #20202a)",
                }}
            >
                {value}
            </div>
        </div>
    );
}