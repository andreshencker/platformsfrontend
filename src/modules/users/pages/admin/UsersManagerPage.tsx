// src/modules/users/pages/admin/UsersPage.tsx
import React from "react";
import UsersManager from "../../components/UsersManager";

// ⬇️ importa el provider y el switcher del theme
import { ThemeProvider } from "@/app/common/theme/ThemeProvider";
import { ThemeSwitcher } from "@/app/common/theme/ThemeSwitcher";

// ⚠️ asegúrate de que el CSS del theme se cargue una sola vez en tu app.
// Puedes importarlo aquí si aún no lo haces en otro lado (main.tsx/Providers).
import "@/app/common/theme/theme.css";

export default function UsersPage() {
    return (
        <ThemeProvider>
            <main className="container section">
                <div
                    className="row"
                    style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}
                >
                    <h2 className="h2" style={{ margin: 0 }}>Users</h2>
                    <ThemeSwitcher />
                </div>

                <UsersManager />
            </main>
        </ThemeProvider>
    );
}