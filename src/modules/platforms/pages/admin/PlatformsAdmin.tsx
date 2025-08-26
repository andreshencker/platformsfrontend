// src/modules/platforms/pages/admin/PlatformsAdminPage.tsx
import React from "react";
import PlatformAdminPanel from "../../components/PlatformAdminPanel";

export default function PlatformsAdminPage() {
    return (
        <div className="container" style={{ marginTop: 20 }}>
            <section
                className="auth-card"
                style={{ padding: 20, borderRadius: 16, border: "1px solid var(--border, #20202a)" }}
            >
                <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <div style={{ fontSize: 14, color: "var(--muted)" }}>Admin</div>
                        <h2 className="h2">Manage Platforms</h2>
                        <div className="muted" style={{ fontSize: 13 }}>
                            Create, edit and toggle support/active flags for platforms.
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <PlatformAdminPanel />
                </div>
            </section>
        </div>
    );
}