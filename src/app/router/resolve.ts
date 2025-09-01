// src/app/router/resolve.ts
import type { StoredUser } from "@/app/lib/storage";

// si ya tienes esta información en AppContext:
type ResolveInput = {
    user: StoredUser | null;
    app: {
        ready: boolean;
        platformId: string | null;
        userPlatformId: string | null;
        connectionType: string | null;
        userPlatformStatus?: "pending" | "connected" | "disconnected" | "error"; // si la traes
        // si no la traes, sólo usamos platformId para decidir onboarding
    };
};

export function resolveLanding({ user, app }: ResolveInput): string {
    // Sin usuario → login
    if (!user) return "/login";

    // Caso admin
    if (user.role === "admin") return "/admin/dashboard";

    // Caso client
    const needsOnboarding =
        !app.platformId ||
        (app.userPlatformStatus && app.userPlatformStatus !== "connected");

    if (needsOnboarding) return "/client/onboarding";

    // Con plataforma activa, manda al landing de esa plataforma
    // Por ahora tenemos Binance; si agregas más, añade casos o usa tu diccionario
    return "/client/binance/dashboard";
}