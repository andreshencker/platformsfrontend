import { api } from '@/lib/http';
import type { BinanceAccount, CreateBinanceAccountDto, UpdateBinanceAccountDto } from './types';

const BASE = '/integrations/binance-accounts';

export async function listBinanceAccounts(userPlatformId?: string): Promise<BinanceAccount[]> {
    const { data } = await api.get<BinanceAccount[]>(BASE, { params: { userPlatformId } });
    return data ?? [];
}

export async function createBinanceAccount(dto: CreateBinanceAccountDto): Promise<BinanceAccount> {
    const { data } = await api.post<BinanceAccount>(BASE, dto);
    return data;
}

export async function updateBinanceAccount(id: string, dto: UpdateBinanceAccountDto): Promise<BinanceAccount> {
    const { data } = await api.patch<BinanceAccount>(`${BASE}/${id}`, dto);
    return data;
}

export async function deleteBinanceAccount(id: string): Promise<{ ok: true }> {
    const { data } = await api.delete<{ ok: true }>(`${BASE}/${id}`);
    return data;
}