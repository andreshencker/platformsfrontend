// src/lib/constants.ts

/** Base URL del backend (Vite) */
export const API_URL: string =
    (import.meta.env.VITE_API_URL as string)?.trim() || "http://localhost:3000";

/** Prefijo para claves en localStorage (evita colisiones entre apps) */
export const STORAGE_PREFIX = "binancefront";

/** Claves de storage */
export const TOKEN_KEY = `${STORAGE_PREFIX}:token`;
export const USER_KEY = `${STORAGE_PREFIX}:user`;

/** Roles soportados (debes alinear con tu backend) */
export enum UserRole {
    ADMIN = "admin",
    CLIENT = "client",
}

/** Rutas comunes (útiles para navegar sin hardcodear strings) */
export const ROUTES = {
    login: "/login",
    register: "/register",

    settings: "/settings",
    unauthorized: "/unauthorized",      // <-- añade esto
    adminDashboard: "/admin/dashboard", // opcional
    clientDashboard: "client/dashboard",      // opcional
    Onboarding: "client/onboarding",
} as const;

/** Timeout por defecto para llamadas HTTP (ms) */
export const HTTP_TIMEOUT = 25_000;

/** Cabecera HTTP que esperamos usar para el bearer token */
export const AUTH_HEADER = "Authorization";