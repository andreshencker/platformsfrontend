import { api } from "@/app/lib/http";
import type {
    User,
    ListUsersParams,
    CreateUserDto,
    UpdateUserDto,
    UpdateUserRoleDto,
} from "../types/types";

export async function listUsers(params: ListUsersParams = {}) {
    const res = await api.get("/users", { params });
    return res.data;
}

export async function getUserById(id: string) {
    const res = await api.get<User>(`/users/${id}`);
    return res.data;
}

export async function registerUser(dto: CreateUserDto) {
    const res = await api.post<User>("/users/", dto);
    return res.data;
}
export async function createUser(dto: CreateUserDto) {
    return registerUser(dto);
}

export async function updateUser(id: string, dto: UpdateUserDto) {
    const res = await api.patch<User>(`/users/${id}`, dto);
    return res.data;
}

/** ✅ NUEVO: actualizar MI perfil sin id */
export async function updateMe(dto: UpdateUserDto) {
    const res = await api.patch<{ status: number; data: User }>(`/users/me`, dto);
    // tu controlador envuelve en { status, data }
    return (res.data as any).data ?? (res.data as any);
}

export async function deleteUser(id: string) {
    const res = await api.delete<void>(`/users/${id}`);
    return res.data;
}

export async function updateUserRole(id: string, dto: UpdateUserRoleDto) {
    const res = await api.patch<User>(`/users/${id}/role`, dto);
    return res.data;
}