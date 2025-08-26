import {UserRole} from "@/modules/users/api/users";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string; // ISO
    updatedAt: string; // ISO
}

export interface Paginated<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}

export interface ListUsersParams {
    page?: number;
    pageSize?: number;
    q?: string;        // búsqueda libre
    role?: UserRole;   // filtro por rol
    active?: boolean;  // filtro por estado
}

export interface CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface CreateAdminDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface UpdateUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string; // si aplica
}

export interface UpdateUserRoleDto {
    role: UserRole;
}

/** Estructura genérica de error del backend (ajústala si tu API usa otra) */
export interface BackendError {
    statusCode: number;
    message: string | string[];
    error?: string;
}