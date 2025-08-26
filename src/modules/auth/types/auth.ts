export type UserRole = 'admin' | 'client';

export interface AuthUser {
    _id: string;
    email: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    secondLastName?: string;
    role: UserRole;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface ChangePasswordDto {
    current: string;
    next: string;
}

export interface AuthResponse {
    status: number;
    user: AuthUser;
    access_token: string;
}