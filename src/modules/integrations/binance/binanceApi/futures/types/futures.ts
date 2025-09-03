// Tipos base para Futures

export type FuturesSegment = "USDM" | "COINM" | "OPTIONS";
export const FUTURES_SEGMENTS: FuturesSegment[] = ["USDM", "COINM", "OPTIONS"];

export type FutureSymbol = {
    symbol: string; // Mostrar solo el nombre del símbolo en el picker
};

// Favorito del usuario (colección user-symbols)
export type UserSymbol = {
    _id: string;
    symbol: string;
    segment: FuturesSegment;
    createdAt?: string;
};