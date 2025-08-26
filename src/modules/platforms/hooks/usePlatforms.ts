import { useQuery } from "@tanstack/react-query";
import {
    fetchPlatforms,
} from "@/modules/platforms/api/platforms";
import { Platform } from "@/modules/platforms/types/platforms";

/** Hook simple para traer plataformas */
export function usePlatforms(onlyActive = true) {
    return useQuery<Platform[], Error>({
        queryKey: ["platforms", { onlyActive }],
        queryFn: () => fetchPlatforms(onlyActive ? { onlyActive: true } : undefined),
        staleTime: 60_000,
    });
}