import { api } from '@/lib/http';
import { setAuthToken as storeToken, clearAuthToken as wipeToken } from '@/lib/storage';
import type { AuthResponse, ChangePasswordDto, LoginDto, RegisterDto } from '../types/auth';

export async function login(dto: LoginDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', dto);
    storeToken(data.access_token);
    return data;
}

export async function register(dto: RegisterDto): Promise<AuthResponse> {
    // Backend devuelve access_token + user (ideal). Si devolviera solo user,
    // haz un login inmediato aquí con dto.email/dto.password.
    const { data } = await api.post<AuthResponse>('/auth/register', dto);
    storeToken(data.access_token);
    return data;
}

export async function me() {
    const { data } = await api.get<{ status: number; user: any }>('/auth/me');
    return data.user;
}

export async function changePassword(payload: ChangePasswordDto) {
    const { data } = await api.patch<{ status: number; message: string }>('/auth/password', payload);
    return data;
}

export function clearSession() {
    wipeToken();
}