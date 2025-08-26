import React from "react";

// Hook de datos
import { useUsers } from "@/modules/users/hooks/useUsers";

// Componentes UI
import UsersTable from "@/modules/users/components/UsersTable";
import CreateAdminDialog from "@/modules/users/components/CreateAdminDialog";
import UserRoleDialog from "@/modules/users/components/UserRoleDialog";

// 👉 Importa y usa el tipo de usuario
import type { User } from "@/modules/users/types/types";

export default function UsersListPage() {
    const { data, isLoading, refetch } = useUsers();

    // Aseguramos el tipo del array
    const users: User[] = Array.isArray(data) ? (data as User[]) : [];

    return (
        <div className="container page">
            {/* Encabezado */}
            <header className="page-head">
                <div>
                    <div className="badge">SECURE • FAST</div>
                    <h1>Users</h1>
                    <p>Manage platform users & roles.</p>
                </div>

                {/* Crear nuevo admin */}
                <CreateAdminDialog onCreated={() => refetch()} />
            </header>

            {/* Tabla */}
            <section className="card p-0">
                {isLoading ? (
                    <div className="p-6">Loading users…</div>
                ) : (
                    <UsersTable rows={users} onRoleChange={() => refetch()} />
                )}
            </section>

            {/* Diálogo para cambio de rol (deja montado si tu UsersTable lo dispara por contexto/prop) */}
            <UserRoleDialog onUpdated={() => refetch()} />
        </div>
    );
}