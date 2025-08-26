// src/modules/userPlatforms/api/userPlatforms.ts

import {  api } from "@/lib/http"; // usa tu wrapper (alias a axios/fetch)

// ---- Tipos ----
export type UserPlatformStatus =
    | "pending"
    | "connected"
    | "disconnected"
    | "error";

export interface UserPlatform {
    _id: string;
    userId: string;
    platformId: string;
    status: UserPlatformStatus;
    isActive: boolean;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserPlatformBody {
    platformId: string;
    isDefault?: boolean;
}

export interface ApiEnvelope<T> {
    statusCode?: number;
    status?: number;
    message: string;
    data: T;
}

// ---- API ----

export async function listUserPlatforms(): Promise<UserPlatform[]> {
    const res = await api.get<ApiEnvelope<UserPlatform[]>>("/user-platforms");
    return res.data.data;
}

export async function getUserPlatformById(id: string): Promise<UserPlatform> {
    const res = await api.get<ApiEnvelope<UserPlatform>>(`/user-platforms/${id}`);
    return res.data.data;
}

export async function createUserPlatform(
    body: CreateUserPlatformBody
): Promise<UserPlatform> {
    const res = await api.post<ApiEnvelope<UserPlatform>>(
        "/user-platforms",
        body
    );
    return res.data.data;
}

export async function setDefaultUserPlatform(id: string): Promise<UserPlatform> {
    const res = await api.patch<ApiEnvelope<UserPlatform>>(
        `/user-platforms/${id}/default`
    );
    return res.data.data;
}

/**
 * Export con el nombre que está importando BinanceCredentialsForm:
 * PATCH /user-platforms/:id/status  { status }
 */
export async function changeUserPlatformStatus(
    id: string,
    status: UserPlatformStatus
): Promise<UserPlatform> {
    const res = await api.patch<ApiEnvelope<UserPlatform>>(
        `/user-platforms/${id}/status`,
        { status }
    );
    return res.data.data;
}

/** Patch genérico para isActive / isDefault (si lo usas en otras pantallas) */
export async function updateUserPlatform(
    id: string,
    patch: Partial<Pick<UserPlatform, "isActive" | "isDefault">>
): Promise<UserPlatform> {
    const res = await api.patch<ApiEnvelope<UserPlatform>>(
        `/user-platforms/${id}`,
        patch
    );
    return res.data.data;
}

export async function removeUserPlatform(
    id: string
): Promise<{ ok: boolean }> {
    const res = await api.delete<ApiEnvelope<{ ok: boolean }>>(
        `/user-platforms/${id}`
    );
    return res.data.data;
}