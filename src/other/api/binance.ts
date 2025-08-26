import axios from "axios";

export type Market = "USDM" | "COINM" | "OPTIONS";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
    withCredentials: false,
});

// Normaliza segundos/ISO/Date → milisegundos
const toMs = (v: any) => {
    if (v === undefined || v === null || v === "") return undefined;
    if (v instanceof Date) return v.getTime();
    if (typeof v === "string" && /\D/.test(v)) {
        const t = Date.parse(v);
        return Number.isNaN(t) ? undefined : t;
    }
    const n = Number(v);
    if (Number.isNaN(n)) return undefined;
    return n < 10_000_000_000 ? n * 1000 : n; // segundos → ms
};

export async function fetchSymbols(market: Market): Promise<string[]> {
    const { data } = await api.get("/binance/markets/symbols", { params: { market } });
    return Array.isArray(data) ? data : [];
}

type FetchTradesParams = {
    market: Market;
    symbol: string;
    startTime?: number | string | Date;
    endTime?: number | string | Date;
    limit?: number;
    fromId?: number;
};

export async function fetchTrades(p: FetchTradesParams) {
    const params: any = {
        market: p.market,
        symbol: p.symbol,
        startTime: toMs(p.startTime),
        endTime: toMs(p.endTime),
        limit: p.limit ?? 1000,
        fromId: p.fromId,
    };
    Object.keys(params).forEach((k) => params[k] === undefined && delete params[k]);

    const { data } = await api.get("/binance/markets/trades", { params });
    return data;
}

/** Export para tu página Income (si la usas) */
type IncomeParams = {
    symbol?: string;
    incomeType?: string;
    startTime?: number | string | Date;
    endTime?: number | string | Date;
    limit?: number;
};
export async function getIncome(p: IncomeParams) {
    const params: any = {
        symbol: p.symbol,
        incomeType: p.incomeType,
        startTime: toMs(p.startTime),
        endTime: toMs(p.endTime),
        limit: p.limit ?? 1000,
    };
    Object.keys(params).forEach((k) => params[k] === undefined && delete params[k]);

    // Si tu backend expone este endpoint:
    const { data } = await api.get("/binance/futures/income", { params });
    return data;
}


export async function fetchPositions() {
    const res = await fetch("/binance/futures/positions");
    if (!res.ok) throw new Error("Error al obtener posiciones");
    return res.json();
}