// src/app/common/layout/client/clientNav.ts
import type { ElementType } from "react";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

export type TopNavItem = { label: string; path: string; icon: ElementType };
export type SideNavItem = { label: string; path: string; icon: ElementType };

export type PlatformNav = {
    id: string;          // DB id de la plataforma
    slug: string;        // "binance"
    landing: string;     // ruta inicial para esa plataforma
    topNav: TopNavItem[];   // ítems del NAVBAR (arriba)
    sideNav: SideNavItem[]; // ítems del SIDEBAR (abajo del panel de usuario)
};

/**
 * Mapa maestro por DB id (usa los ids reales de tu backend).
 * Si mañana soportas más plataformas, añádelas aquí.
 */
export const PLATFORM_BY_DBID: Record<string, PlatformNav> = {
    "68a078d84c405bf778248390": {
        id: "68a078d84c405bf778248390",
        slug: "binance",
        landing: "/client/binance/dashboard",
        topNav: [
            { label: "Dashboard", path: "/client/binance/dashboard", icon: DashboardRoundedIcon },
            { label: "Spot",      path: "/client/binance/spot",      icon: ShowChartRoundedIcon },
            { label: "Futures",   path: "/client/binance/futures",   icon: TimelineRoundedIcon },
            { label: "Margin",    path: "/client/binance/margin",    icon: TimelineRoundedIcon },
        ],
        sideNav: [
            { label: "Settings",  path: "/client/settings",  icon: SettingsRoundedIcon },
        ],
    },
};

// También puedes necesitar el inverso (slug -> nav), por si te resulta útil:
export const PLATFORM_BY_SLUG: Record<string, PlatformNav> =
    Object.values(PLATFORM_BY_DBID).reduce((acc, p) => {
        acc[p.slug] = p;
        return acc;
    }, {} as Record<string, PlatformNav>);

// ==== helpers ====

export function getPlatformNavByDbId(platformDbId: string | null | undefined): PlatformNav | null {
    if (!platformDbId) return null;
    return PLATFORM_BY_DBID[platformDbId] ?? null;
}

export function getPlatformLandingByDbId(platformDbId: string | null | undefined): string {
    return getPlatformNavByDbId(platformDbId)?.landing ?? "/client/dashboard";
}