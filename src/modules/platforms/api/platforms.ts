import { api } from "@/lib/http";
import {
    Platform,
    ApiEnvelope,
    ListPlatformsParams,
} from "@/modules/platforms/types/platforms";

const BASE = "/platforms";

/** Normaliza la respuesta para soportar
 *  - Array directo:           resp.data         => Platform[]
 *  - Envelope { data: [...] } resp.data.data    => Platform[]
 */
function normalizeArray<T>(respData: any): T[] {
    if (Array.isArray(respData)) return respData as T[];
    if (respData?.data && Array.isArray(respData.data)) return respData.data as T[];
    // último intento: si el backend envía { data: { data: [...] } }
    if (respData?.data?.data && Array.isArray(respData.data.data)) {
        return respData.data.data as T[];
    }
    return [];
}

/** Lista plataformas */
export async function fetchPlatforms(
    params?: ListPlatformsParams
): Promise<Platform[]> {
    const resp = await api.get<Platform[] | ApiEnvelope<Platform[]>>(BASE, {
        params,
    });
    return normalizeArray<Platform>(resp.data);
}

/** Detalle de una plataforma */
export async function fetchPlatformById(id: string): Promise<Platform | null> {
    const resp = await api.get<Platform | ApiEnvelope<Platform>>(`${BASE}/${id}?supported=True`);
    const d: any = resp.data;
    if (d && !("data" in d)) return d as Platform;
    if (d?.data) return d.data as Platform;
    return null;
}