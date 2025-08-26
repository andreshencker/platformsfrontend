import { useQuery } from "@tanstack/react-query";
import { fetchTrades, type Market } from "@/other/api/binance";

type Params = {
    market: Market;
    symbol: string;
    startTime?: number | string | Date;
    endTime?: number | string | Date;
    limit?: number;
    fromId?: number;
};

export function useTrades(params: Params, enabled = true) {
    return useQuery({
        queryKey: ["trades", params],
        queryFn: () => fetchTrades(params),
        enabled: enabled && !!params.symbol && !!params.market,
        keepPreviousData: true,
    });
}