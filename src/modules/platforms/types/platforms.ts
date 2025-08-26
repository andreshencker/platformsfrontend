// src/modules/platforms/api/types.ts

export type PlatformId = string;

/** Modelo base que devuelve el backend */
export interface Platform {
    _id: PlatformId;
    /** opcional si tu backend lo expone */
    code?: string;                 // p.ej. "binance"
    name: string;                  // p.ej. "Binance"
    category?: string;             // p.ej. "exchange"
    imageUrl?: string;
    isActive?: boolean;
    /** en tu backend lo llamaste isSupported */
    isSupported?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

/** Crear/actualizar (ajusta campos opcionales según tu backend) */
export interface CreatePlatformDto {
    code?: string;
    name: string;
    category?: string;
    imageUrl?: string;
    isActive?: boolean;
    isSupported?: boolean;
}

export type UpdatePlatformDto = Partial<CreatePlatformDto>;

/** Parámetros de listado */
export interface ListPlatformsParams {
    /** si tu backend filtra por activas */
    onlyActive?: boolean;
}