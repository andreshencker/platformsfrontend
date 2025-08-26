import { useQuery } from "@tanstack/react-query";
import { fetchSymbols, type Market } from "@/other/api/binance"; // ⬅️ cambia getMarketSymbols → fetchSymbols

/**
 * Hook de símbolos. Por defecto NO auto-ejecuta (enabled=false)
 * para dispararlo solo al hacer click en Apply con refetch().
 */
export function useSymbols(market?: Market, enabled = false) {
    return useQuery({
        queryKey: ["symbols", market],
        queryFn: () => fetchSymbols(market as Market),
        enabled: Boolean(market) && enabled,
        staleTime: 5 * 60 * 1000,
    });
}