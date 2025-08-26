// /src/api/binanceAccounts.ts
import http from "@/lib/http";

/** ==== Tipos compartidos ==== */
export type BinanceAccount = {
    id: string;               // mapeado en backend a _id
    platformId: string;
    description: string;
    apiKey: string;           // el backend devuelve el valor (no se oculta)
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export type CreateBinanceAccountDTO = {
    platformId: string;
    description: string;
    apiKey: string;
    apiSecret: string;        // NO se devuelve nunca en las respuestas
    isActive?: boolean;
};

export type UpdateBinanceAccountDTO = Partial<{
    description: string;
    apiKey: string;
    apiSecret: string;        // opcional en update
    isActive: boolean;
}>;

/** ==== API ==== */

// Lista las cuentas del usuario para una plataforma
export async function listByPlatform(platformId: string) {
    const { data } = await http.get<{
        statusCode: number;
        message: string;
        data: BinanceAccount[];
    }>("/integrations/binance-accounts", { params: { platformId } });

    return data.data;
}

// Crea una cuenta
export async function createAccount(payload: CreateBinanceAccountDTO) {
    const { data } = await http.post<{
        statusCode: number;
        message: string;
        data: BinanceAccount;
    }>("/integrations/binance-accounts", payload);

    return data.data;
}

// Actualiza una cuenta
export async function updateAccount(id: string, payload: UpdateBinanceAccountDTO) {
    const { data } = await http.patch<{
        statusCode: number;
        message: string;
        data: BinanceAccount;
    }>(`/integrations/binance-accounts/${id}`, payload);

    return data.data;
}

// Elimina una cuenta
export async function removeAccount(id: string) {
    const { data } = await http.delete<{
        statusCode: number;
        message: string;
    }>(`/integrations/binance-accounts/${id}`);

    return data.message;
}