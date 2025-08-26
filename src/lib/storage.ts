// src/lib/storage.ts

// Claves estándar
const AUTH_TOKEN_KEY = "auth:token";
const AUTH_USER_KEY  = "auth:user";

// Helpers genéricos (usados por AppContext y otros)
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

// Token
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
export const getAuthToken  = getToken;
export const setAuthToken  = setToken;
export const clearAuthToken = clearToken;

// Usuario
export type StoredUser = {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
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

// Sesión completa
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