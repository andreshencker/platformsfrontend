// src/app/lib/storage.ts

// -----------------------------
// Claves estándar de almacenamiento
// -----------------------------
const AUTH_TOKEN_KEY = "auth:token";
const AUTH_USER_KEY  = "auth:user";

const KEY_PLATFORM_ID     = "app.platformId";
const KEY_CONN_TYPE       = "app.connectionType";
const KEY_BN_ACCOUNT_ID   = "app.binanceAccountId";

// -----------------------------
// Helpers genéricos (JSON safe)
// -----------------------------
export function getItem<T = unknown>(key: string): T | null {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

export function setItem<T = unknown>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {}
}

export function removeItem(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch {}
}

/** Wrapper para usar como storage.get / storage.set / storage.remove */
export const storage = {
    get: getItem,
    set: setItem,
    remove: removeItem,
};

// -----------------------------
// Token helpers
// -----------------------------
export function getToken(): string | null {
    try {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
        return null;
    }
}

export function setToken(token: string): void {
    try {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch {}
}

export function clearToken(): void {
    try {
        localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch {}
}

// Alias para compatibilidad con código existente
export const getAuthToken   = getToken;
export const setAuthToken   = setToken;
export const clearAuthToken = clearToken;

// -----------------------------
// Usuario
// -----------------------------
export type StoredUser = {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    avatarUrl?: string;
    [k: string]: any;
} | null;

export function getUser<T extends StoredUser = StoredUser>(): T {
    return getItem<T>(AUTH_USER_KEY);
}

export function setUser(user: StoredUser): void {
    setItem(AUTH_USER_KEY, user);
}

export function clearUser(): void {
    removeItem(AUTH_USER_KEY);
}

// -----------------------------
// Sesión completa (token + user)
// -----------------------------
export function saveSession(token: string, user: StoredUser): void {
    setToken(token);
    setUser(user);
}

export function loadSession(): { token: string | null; user: StoredUser } {
    return { token: getToken(), user: getUser() };
}

export function clearSession(): void {
    clearToken();
    clearUser();
}

// -----------------------------
// Helpers específicos de AppContext
// (si prefieres usarlos en otros sitios)
// -----------------------------
export function savePlatformId(v: string | null) {
    if (v) localStorage.setItem(KEY_PLATFORM_ID, v);
    else localStorage.removeItem(KEY_PLATFORM_ID);
}
export function loadPlatformId(): string | null {
    return localStorage.getItem(KEY_PLATFORM_ID);
}

export function saveConnectionType(v: string | null) {
    if (v) localStorage.setItem(KEY_CONN_TYPE, v);
    else localStorage.removeItem(KEY_CONN_TYPE);
}
export function loadConnectionType(): string | null {
    return localStorage.getItem(KEY_CONN_TYPE);
}

export function saveBinanceAccountId(v: string | null) {
    if (v) localStorage.setItem(KEY_BN_ACCOUNT_ID, v);
    else localStorage.removeItem(KEY_BN_ACCOUNT_ID);
}
export function loadBinanceAccountId(): string | null {
    return localStorage.getItem(KEY_BN_ACCOUNT_ID);
}