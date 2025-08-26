// src/modules/users/api/users.ts

import { http } from "@/lib/http";
import type {
    User,
    CreateAdminDto,
    UpdateUserRoleDto,
    ListUsersParams,
    Paginated,
    CreateUserDto,
    UpdateUserDto
} from "../types/types";



export type UserRole = "admin" | "client";

/** Lista paginada de usuarios */
export async function listUsers(params: ListUsersParams = {}) {
    const res = await http.get<Paginated<User>>("/users", { params });
    return res.data;
}

/** Detalle de usuario por id */
export async function getUserById(id: string) {
    const res = await http.get<User>(`/users/${id}`);
    return res.data;
}

/** Crear usuario genérico (admin o client) */
export async function createUser(dto: CreateUserDto) {
    const res = await http.post<User>("/users", dto);
    return res.data;
}

/** Crear administrador de forma directa (si tienes un endpoint dedicado) */
export async function createAdmin(dto: CreateAdminDto) {
    const res = await http.post<User>("/users/admin", dto);
    return res.data;
}

/** Actualizar datos de un usuario */
export async function updateUser(id: string, dto: UpdateUserDto) {
    const res = await http.patch<User>(`/users/${id}`, dto);
    return res.data;
}

/** Cambiar rol de un usuario */
export async function updateUserRole(id: string, dto: UpdateUserRoleDto) {
    const res = await http.patch<User>(`/users/${id}/role`, dto);
    return res.data;
}

/** Activar/Desactivar usuario */
export async function toggleUserActive(id: string, active: boolean) {
    const res = await http.patch<User>(`/users/${id}`, { isActive: active });
    return res.data;
}

/** Eliminar usuario */
export async function deleteUser(id: string) {
    const res = await http.delete<void>(`/users/${id}`);
    return res.data;
}