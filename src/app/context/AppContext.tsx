// src/app/context/AppContext.tsx
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    ReactNode,
} from 'react';
import toast from 'react-hot-toast';

import { useAuth } from '@/modules/auth/hooks/useAuth';
import { storage } from '@/app/lib/storage';

import { listUserPlatforms } from '@/modules/userPlatforms/api/userPlatforms';
import { listBinanceAccounts } from '@/modules/integrations/binance/api/binanceAccounts';

// =========================
// Tipos (shape real de la API)
// =========================
type Maybe<T> = T | null;

type UserPlatformRow = {
    _id: string;
    userId: string;
    platformId: string;              // FK plano
    status?: 'pending'|'connected'|'disconnected'|'error';
    isDefault?: boolean;
    isActive?: boolean;
    platform?: {
        _id: string;                   // mismo que platformId
        name: string;
        imageUrl?: string;             // <- la imagen que queremos guardar
        connectionType?: string;       // 'apikey' | 'oauth' | ...
    };
};

type BinanceAccountRow = {
    _id: string;
    userPlatformId: string;
    apiKey?: string;
    isDefault?: boolean;
    isActive?: boolean;
    description?: string;
};

// =========================
// Claves de storage
// =========================
const SKEY = {
    PLATFORM_ID:       'app.platformId',
    USER_PLATFORM_ID:  'app.userPlatformId',
    CONNECTION_TYPE:   'app.connectionType',
    BINANCE_ACCOUNT_ID:'app.binanceAccountId',
    PLATFORM_IMAGE:    'app.platformImage', // ← NUEVO (opcional, para el UI)
} as const;

// =========================
// Estado de App
// =========================
type AppState = {
    platformId: Maybe<string>;
    userPlatformId: Maybe<string>;
    connectionType: Maybe<string>;
    binanceAccountId: Maybe<string>;

    booting: boolean;
    ready: boolean;
    error: Maybe<string>;
};

const initialState: AppState = {
    platformId:       storage.get<string>(SKEY.PLATFORM_ID) ?? null,
    userPlatformId:   storage.get<string>(SKEY.USER_PLATFORM_ID) ?? null,
    connectionType:   storage.get<string>(SKEY.CONNECTION_TYPE) ?? null,
    binanceAccountId: storage.get<string>(SKEY.BINANCE_ACCOUNT_ID) ?? null,
    booting: false,
    ready: false,
    error: null,
};

// =========================
type AppContextValue = AppState & {
    refresh: () => Promise<void>;
    reset: () => void;

    setPlatformId: (v: Maybe<string>) => void;
    setUserPlatformId: (v: Maybe<string>) => void;
    setConnectionType: (v: Maybe<string>) => void;
    setBinanceAccountId: (v: Maybe<string>) => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

// =========================
// Provider
// =========================
export function AppProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();
    const [state, setState] = useState<AppState>(initialState);
    const once = useRef(false);

    // ----- setters + persistencia -----
    const setPlatformId = useCallback((v: Maybe<string>) => {
        setState(s => ({ ...s, platformId: v }));
        storage.set(SKEY.PLATFORM_ID, v);
    }, []);

    const setUserPlatformId = useCallback((v: Maybe<string>) => {
        setState(s => ({ ...s, userPlatformId: v }));
        storage.set(SKEY.USER_PLATFORM_ID, v);
    }, []);

    const setConnectionType = useCallback((v: Maybe<string>) => {
        setState(s => ({ ...s, connectionType: v }));
        storage.set(SKEY.CONNECTION_TYPE, v);
    }, []);

    const setBinanceAccountId = useCallback((v: Maybe<string>) => {
        setState(s => ({ ...s, binanceAccountId: v }));
        storage.set(SKEY.BINANCE_ACCOUNT_ID, v);
    }, []);

    const setBooting = (booting: boolean) => setState(s => ({ ...s, booting }));
    const setReady   = (ready: boolean)   => setState(s => ({ ...s, ready }));
    const setError   = (error: Maybe<string>) => setState(s => ({ ...s, error }));

    const clearStorage = () => {
        storage.remove(SKEY.PLATFORM_ID);
        storage.remove(SKEY.USER_PLATFORM_ID);
        storage.remove(SKEY.CONNECTION_TYPE);
        storage.remove(SKEY.BINANCE_ACCOUNT_ID);
        storage.remove(SKEY.PLATFORM_IMAGE);
    };

    // ----- bootstrap -----
    const loadDefaultUserPlatform = useCallback(async (): Promise<UserPlatformRow | null> => {
        const rows: UserPlatformRow[] = await listUserPlatforms();
        if (!Array.isArray(rows) || rows.length === 0) return null;
        return rows.find(r => r.isDefault) ?? rows[0] ?? null;
    }, []);

    const resolveDefaultBinanceAccount = useCallback(
        async (userPlatformId: string): Promise<Maybe<string>> => {
            // tu API acepta { userPlatformId } como params
            const accounts: BinanceAccountRow[] = await listBinanceAccounts({ userPlatformId } as any);
            if (!Array.isArray(accounts) || accounts.length === 0) return null;
            const def = accounts.find(a => a.isDefault) ?? accounts[0];
            return def?._id ?? null;
        },
        []
    );

    const refresh = useCallback(async () => {
        if (!isAuthenticated) {
            setReady(true);
            return;
        }

        try {
            setBooting(true);
            setError(null);

            // 1) UserPlatform por defecto
            const up = await loadDefaultUserPlatform();

            if (!up) {
                // Sin plataformas (onboarding)
                setPlatformId(null);
                setUserPlatformId(null);
                setConnectionType(null);
                setBinanceAccountId(null);
                storage.set(SKEY.PLATFORM_IMAGE, null);
                setReady(true);
                return;
            }

            // 2) Persistir básicos
            setPlatformId(up.platformId ?? up.platform?._id ?? null);
            setUserPlatformId(up._id ?? null);

            // ⚠️ connectionType viene ANIDADO en platform.connectionType
            const connType =
                up.platform?.connectionType ??
                (up as any).connectionType ??
                null;

            setConnectionType(connType);

            // Guardar imagen de la plataforma (opcional, para UI)
            const imageUrl = up.platform?.imageUrl ?? null;
            storage.set(SKEY.PLATFORM_IMAGE, imageUrl);

            // 3) Si es API KEY (p.ej. Binance), resolver cuenta por defecto
            if ((connType ?? '').toLowerCase() === 'apikey') {
                const accId = await resolveDefaultBinanceAccount(up._id);
                setBinanceAccountId(accId);
            } else {
                setBinanceAccountId(null);
            }

            setReady(true);
        } catch (e: any) {
            const msg = e?.message ?? 'Failed to initialize app context';
            setError(msg);
            toast.error(msg);
            setReady(true);
        } finally {
            setBooting(false);
        }
    }, [
        isAuthenticated,
        loadDefaultUserPlatform,
        resolveDefaultBinanceAccount,
        setPlatformId,
        setUserPlatformId,
        setConnectionType,
        setBinanceAccountId,
    ]);

    // ----- reset en logout -----
    const reset = useCallback(() => {
        clearStorage();
        setState({
            platformId: null,
            userPlatformId: null,
            connectionType: null,
            binanceAccountId: null,
            booting: false,
            ready: false,
            error: null,
        });
    }, []);

    // ----- efecto post-login / post-registro -----
    useEffect(() => {
        if (!isAuthenticated) {
            reset();
            return;
        }
        if (once.current) return;
        once.current = true;

        refresh().finally(() => {
            once.current = false;
        });
    }, [isAuthenticated, refresh, reset]);

    const value = useMemo<AppContextValue>(
        () => ({
            ...state,
            refresh,
            reset,
            setPlatformId,
            setUserPlatformId,
            setConnectionType,
            setBinanceAccountId,
        }),
        [state, refresh, reset, setPlatformId, setUserPlatformId, setConnectionType, setBinanceAccountId]
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// =========================
// Hook de consumo
// =========================
export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) {
        throw new Error('useApp must be used within <AppProvider>');
    }
    return ctx;
}