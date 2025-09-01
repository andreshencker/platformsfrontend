// src/app/lib/http.ts
import axios, { AxiosError } from "axios";
import { API_URL, HTTP_TIMEOUT } from "./constants";
import { getToken } from "./storage";

/**
 * Axios central:
 * - baseURL desde VITE_API_URL
 * - inyecta Authorization si hay token
 * - marca 401/403 en el error para manejo superior
 */
const http = axios.create({
    baseURL: API_URL,
    timeout: HTTP_TIMEOUT,
    withCredentials: false,
});

// ---- Helpers públicos para fijar/quitar el header global ----
export function setAuthHeader(token: string | null) {
    if (token) {
        http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete http.defaults.headers.common["Authorization"];
    }
}

export function clearAuthHeader() {
    delete http.defaults.headers.common["Authorization"];
}

// ---- Interceptors ----
http.interceptors.request.use((config) => {
    // fallback: si no hay header seteado globalmente, usa el token del storage
    if (!config.headers?.Authorization) {
        const token = getToken();
        if (token) {
            config.headers = config.headers ?? {};
            (config.headers as any).Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

http.interceptors.response.use(
    (r) => r,
    (error) => {
        if (error?.response?.status === 401) {
            (error as any).isAuthUnauthorized = true;
        }
        if (error?.response?.status === 403) {
            (error as any).isAuthForbidden = true;
        }
        return Promise.reject(error);
    }
);

// Export por defecto y con nombre para usos mixtos
export default http;
export const api = http;