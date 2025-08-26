// Tipos base del contexto de la app

export type Id = string;

export type UserRole = 'admin' | 'client';

export type AuthUser = {
    id: Id;
    email: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    role: UserRole;
};

export type Session = {
    token: string;
    user: AuthUser | null;
};

export type Platform = {
    _id: Id;
    name: string;
    category: 'exchange' | 'broker' | 'data' | string;
    imageUrl?: string;
    isActive: boolean;
    isSupported: boolean;
    createdAt?: string;
    updatedAt?: string;
};

// Binance account (lo mínimo que necesitamos en el top-level)
export type BinanceAccount = {
    _id: Id;
    platformId: Id;
    description: string;
    apiKey: string;       // visible (no sensible)
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type AppContextValue = {
    // auth
    session: Session | null;
    user: AuthUser | null;
    role: UserRole | null;

    // selección actual
    selectedPlatformId: Id | null;
    selectedAccountId: Id | null;

    // catálogos
    platforms: Platform[];
    accounts: BinanceAccount[];

    // estados de carga
    loadingPlatforms: boolean;
    loadingAccounts: boolean;

    // acciones
    setSelectedPlatformId: (id: Id | null) => void;
    setSelectedAccountId: (id: Id | null) => void;

    refreshPlatforms: () => Promise<void>;
    refreshAccounts: () => Promise<void>;
};