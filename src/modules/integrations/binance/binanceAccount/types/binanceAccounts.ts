export interface BinanceAccount {
    _id: string;
    userId: string;
    userPlatformId: string;
    apiKey: string;           // NO usar en UI
    // apiSecret NO llega
    description?: string;
    isActive: boolean;
    isDefault: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateBinanceAccountDto {
    userPlatformId: string;
    apiKey: string;
    apiSecret: string;
    description?: string;
    isActive?: boolean;
    isDefault?: boolean;
}

export interface UpdateBinanceAccountDto {
    description?: string;
    apiKey?: string;
    apiSecret?: string;
    isActive?: boolean;
    isDefault?: boolean;
}