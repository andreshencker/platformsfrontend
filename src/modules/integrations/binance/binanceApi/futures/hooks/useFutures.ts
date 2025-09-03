import { useQuery } from "@tanstack/react-query";
import { fetchFuturesSymbols, FuturesSegment } from "../api/futures";

export function useFuturesSymbols(segment: FuturesSegment, search: string) {
    return useQuery({
        queryKey: ["futures:symbols", segment, search],
        queryFn: () => fetchFuturesSymbols(segment, search),
        staleTime: 1000 * 60 * 5,
        enabled: !!segment,
    });
}