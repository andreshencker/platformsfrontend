import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    listBinanceAccounts,
    createBinanceAccount,
    updateBinanceAccount,
    deleteBinanceAccount,
} from "../api/binanceAccounts";
import type {
    BinanceAccount,
    CreateBinanceAccountDto,
    UpdateBinanceAccountDto,
} from "../types/binanceAccounts";

const KEY = ["binance-accounts"];

export function useBinanceAccounts() {
    return useQuery<BinanceAccount[], Error>({
        queryKey: KEY,
        queryFn: () => listBinanceAccounts(),
        staleTime: 30_000,
    });
}

export function useCreateBinanceAccount() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (dto: CreateBinanceAccountDto) => createBinanceAccount(dto),
        onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
    });
}

export function useUpdateBinanceAccount() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateBinanceAccountDto }) =>
            updateBinanceAccount(id, dto),
        onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
    });
}

export function useDeleteBinanceAccount() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteBinanceAccount(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
    });
}