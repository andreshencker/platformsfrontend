// modules/users/pages/admin/UsersPage.tsx
import React from "react";
import UsersManager from "../../components/UsersManager";

export default function UsersPage() {
    return (
        <main className="container section">
            <h2 className="h2" style={{ marginBottom: 12 }}>Users</h2>
            <UsersManager />
        </main>
    );
}