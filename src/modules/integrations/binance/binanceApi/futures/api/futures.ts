import { api } from "@/app/lib/http";
import type { FuturesSegment } from "../types/futures";


export type FuturesSegment = "USDM" | "COINM" | "OPTIONS";

export async function fetchFuturesSymbols(segment: FuturesSegment, search?: string) {
    const { data } = await api.get<{ statusCode?: number; message?: string; data: string[] }>(
        `/binance/futures/symbols/${segment}`,
        { params: { search: search || undefined } }
    );
    return data?.data ?? [];
}