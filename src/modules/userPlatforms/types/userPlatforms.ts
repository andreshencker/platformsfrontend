// Tipos del dominio para UserPlatform

export type UserPlatformStatus = 'pending' | 'connected' | 'disconnected' | 'error';

export interface UserPlatform {
    _id: string;
    userId: string;
    platformId: string;
    // virtual/expandible si el backend lo devuelve
    platform?: {
        _id: string;
        name: string;
        code: string;
        imageUrl?: string;
    };
    status: UserPlatformStatus;
    isActive: boolean;
    isDefault: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// DTOs (coinciden con tus controladores)
export interface CreateUserPlatformDto {
    platformId: string;
    isDefault?: boolean; // opcional
}

export interface UpdateUserPlatformDto {
    isActive?: boolean;
    isDefault?: boolean; // si permites cambiarlo aquí; de lo contrario usa el endpoint dedicado
}

export interface ChangeUserPlatformStatusDto {
    status: UserPlatformStatus;
}

// Helpers
export const USER_PLATFORM_LS_KEY = 'userPlatformId';