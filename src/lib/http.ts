// src/lib/http.ts
import axios, { AxiosError } from "axios";
import { API_URL, HTTP_TIMEOUT } from "./constants";
import { getToken, clearSession } from "./storage";

/**
 * Axios central:
 * - baseURL desde VITE_API_URL
 * - inyecta Authorization si hay token
 * - limpia sesión ante 401
 */
const http = axios.create({
    baseURL: API_URL,
    timeout: HTTP_TIMEOUT,
    withCredentials: false,
});

http.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${token}`;
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

/**
http.interceptors.response.use(
    (res) => res,
    (err: AxiosError) => {
       const status = err.response?.status;
        if (status === 401) {
          // sesión expirada/ inválida
          clearSession();
        }
        return Promise.reject(err);
    }
);
 */
// Export por defecto y con nombre para usos mixtos
export default http;
export const api = http;