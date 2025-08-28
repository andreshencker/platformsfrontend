import http from "@/app/lib/http";

export type PlatformCategory = "Broker" | "Exchange" | "Data";

export type Platform = {
    id: string;
    name: string;
    category: PlatformCategory;
    image?: string;
    isActive: boolean;
};

export async function getActivePlatforms() {
    const { data } = await http.get<{ data: Platform[] }>("/admin/platforms", {
        params: { isActive: true },
    });
    return data.data;
}