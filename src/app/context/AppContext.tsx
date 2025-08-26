import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { getSupportedPlatforms } from "@/modules/platforms/api/platforms";
import { listMyBinanceAccounts } from "@/modules/integrations/binance/api/binanceAccounts";
import { AppContextValue, AuthUser, BinanceAccount, Id, Platform, Session, UserRole } from "./types";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { getItem, setItem, removeItem } from "@/lib/storage";

// Claves de persistencia
const KEY_SEL_PLATFORM = "app:selected_platform";
const KEY_SEL_ACCOUNT  = "app:selected_account";

const Ctx = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    // Traemos la sesión actual desde el módulo Auth
    const { session, user } = useAuth(); // asume { session, user } del hook de auth
    const role: UserRole | null = user?.role ?? null;

    // Estado global
    const [selectedPlatformId, setSelectedPlatformIdState] = useState<Id | null>(() => getItem(KEY_SEL_PLATFORM));
    const [selectedAccountId, setSelectedAccountIdState]   = useState<Id | null>(() => getItem(KEY_SEL_ACCOUNT));

    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [accounts, setAccounts]   = useState<BinanceAccount[]>([]);

    const [loadingPlatforms, setLoadingPlatforms] = useState(false);
    const [loadingAccounts,  setLoadingAccounts]  = useState(false);

    // Helpers de persistencia para selección
    const setSelectedPlatformId = useCallback((id: Id | null) => {
        setSelectedPlatformIdState(id);
        if (id) setItem(KEY_SEL_PLATFORM, id); else removeItem(KEY_SEL_PLATFORM);
        // Si cambia de plataforma, reseteamos cuenta seleccionada
        setSelectedAccountId(null);
    }, []);

    const setSelectedAccountId = useCallback((id: Id | null) => {
        setSelectedAccountIdState(id);
        if (id) setItem(KEY_SEL_ACCOUNT, id); else removeItem(KEY_SEL_ACCOUNT);
    }, []);

    // Cargar plataformas soportadas (solo con sesión)
    const refreshPlatforms = useCallback(async () => {
        if (!session?.token) {
            setPlatforms([]);
            return;
        }
        try {
            setLoadingPlatforms(true);
            const data = await getSupportedPlatforms(); // GET /platforms?supported=true
            setPlatforms(data);

            // Si no hay selección o la actual dejó de existir, auto-seleccionar la primera
            if (!data.find(p => p._id === selectedPlatformId)) {
                const first = data[0]?._id ?? null;
                setSelectedPlatformId(first);
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "Failed to load platforms");
        } finally {
            setLoadingPlatforms(false);
        }
    }, [session?.token, selectedPlatformId, setSelectedPlatformId]);

    // Cargar cuentas Binance del usuario para la plataforma seleccionada
    const refreshAccounts = useCallback(async () => {
        if (!session?.token || !selectedPlatformId) {
            setAccounts([]);
            return;
        }
        try {
            setLoadingAccounts(true);
            const list = await listMyBinanceAccounts(); // GET /integrations/binance-accounts
            // Filtramos por plataforma seleccionada
            const filtered = list.filter(a => a.platformId === selectedPlatformId);
            setAccounts(filtered);

            // Ajustar cuenta seleccionada si ya no existe
            if (!filtered.find(a => a._id === selectedAccountId)) {
                setSelectedAccountId(filtered[0]?._id ?? null);
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "Failed to load accounts");
        } finally {
            setLoadingAccounts(false);
        }
    }, [session?.token, selectedPlatformId, selectedAccountId, setSelectedAccountId]);

    // Efectos: cuando cambia sesión => recargar catálogos
    useEffect(() => {
        if (session?.token) {
            refreshPlatforms();
        } else {
            // limpiar todo si se cerró sesión
            setPlatforms([]);
            setAccounts([]);
            setSelectedPlatformId(null);
            setSelectedAccountId(null);
        }
    }, [session?.token, refreshPlatforms]);

    // Cuando cambia la plataforma seleccionada, recargar cuentas
    useEffect(() => {
        if (session?.token && selectedPlatformId) {
            refreshAccounts();
        } else {
            setAccounts([]);
            setSelectedAccountId(null);
        }
    }, [session?.token, selectedPlatformId, refreshAccounts]);

    const value = useMemo<AppContextValue>(() => ({
        session: session ?? null,
        user: (user as AuthUser) ?? null,
        role,

        selectedPlatformId,
        selectedAccountId,

        platforms,
        accounts,

        loadingPlatforms,
        loadingAccounts,

        setSelectedPlatformId,
        setSelectedAccountId,

        refreshPlatforms,
        refreshAccounts,
    }), [
        session, user, role,
        selectedPlatformId, selectedAccountId,
        platforms, accounts,
        loadingPlatforms, loadingAccounts,
        setSelectedPlatformId, setSelectedAccountId,
        refreshPlatforms, refreshAccounts,
    ]);

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useApp must be used within <AppProvider>");
    return ctx;
}