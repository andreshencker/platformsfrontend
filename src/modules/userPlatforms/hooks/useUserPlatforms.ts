import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    changeUserPlatformStatus,
    createUserPlatform,
    deleteUserPlatform,
    getUserPlatform,
    listUserPlatforms,
    setDefaultUserPlatform,
    updateUserPlatform,
} from '../api/userPlatforms';
import type {
    CreateUserPlatformDto,
    ChangeUserPlatformStatusDto,
    UpdateUserPlatformDto,
    UserPlatform,
} from '../types/userPlatforms';
import { USER_PLATFORM_LS_KEY } from '../types/userPlatforms';

type AsyncState<T> = {
    data: T;
    loading: boolean;
    error: string | null;
};

export function useUserPlatforms() {
    const [list, setList] = useState<AsyncState<UserPlatform[]>>({
        data: [],
        loading: true,
        error: null,
    });
    const [selectedId, setSelectedId] = useState<string | null>(
        typeof window !== 'undefined' ? localStorage.getItem(USER_PLATFORM_LS_KEY) : null,
    );

    // Utils
    const extractError = (e: any) =>
        e?.response?.data?.message || e?.message || 'Unexpected error';

    const refresh = useCallback(async () => {
        setList((s) => ({ ...s, loading: true, error: null }));
        try {
            const rows = await listUserPlatforms();
            setList({ data: rows, loading: false, error: null });

            // Selección por prioridad: LS -> default -> primera
            if (!selectedId) {
                const defaultOne = rows.find((r) => r.isDefault);
                const pick = defaultOne?._id || rows[0]?._id || null;
                if (pick) {
                    setSelectedId(pick);
                    localStorage.setItem(USER_PLATFORM_LS_KEY, pick);
                }
            } else {
                // Si LS no existe ya, repararlo
                const exists = rows.some((r) => r._id === selectedId);
                if (!exists) {
                    const defaultOne = rows.find((r) => r.isDefault);
                    const pick = defaultOne?._id || rows[0]?._id || null;
                    if (pick) {
                        setSelectedId(pick);
                        localStorage.setItem(USER_PLATFORM_LS_KEY, pick);
                    } else {
                        setSelectedId(null);
                        localStorage.removeItem(USER_PLATFORM_LS_KEY);
                    }
                }
            }
        } catch (e: any) {
            setList((s) => ({ ...s, loading: false, error: extractError(e) }));
        }
    }, [selectedId]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const selected = useMemo(
        () => list.data.find((x) => x._id === selectedId) || null,
        [list.data, selectedId],
    );

    // ---- Actions ----

    const select = useCallback((id: string | null) => {
        setSelectedId(id);
        if (id) localStorage.setItem(USER_PLATFORM_LS_KEY, id);
        else localStorage.removeItem(USER_PLATFORM_LS_KEY);
    }, []);

    const create = useCallback(async (dto: CreateUserPlatformDto) => {
        const item = await createUserPlatform(dto);
        await refresh();
        // si el backend marcó default, respeta; si no hay default previo, selecciona el nuevo
        if (item.isDefault || !list.data.some((r) => r.isDefault)) {
            select(item._id);
        }
        return item;
    }, [refresh, select, list.data]);

    const setDefault = useCallback(async (id: string) => {
        await setDefaultUserPlatform(id);
        await refresh();
        select(id);
    }, [refresh, select]);

    const patchStatus = useCallback(async (id: string, payload: ChangeUserPlatformStatusDto) => {
        const updated = await changeUserPlatformStatus(id, payload);
        await refresh();
        return updated;
    }, [refresh]);

    const patch = useCallback(async (id: string, payload: UpdateUserPlatformDto) => {
        const updated = await updateUserPlatform(id, payload);
        await refresh();
        return updated;
    }, [refresh]);

    const remove = useCallback(async (id: string) => {
        await deleteUserPlatform(id);
        await refresh();
        // si borraste el seleccionado, limpia LS y vuelve a elegir con la regla de arriba
        if (selectedId === id) {
            const next = list.data.find((r) => r._id !== id && r.isDefault)?.._id
                || list.data.find((r) => r._id !== id)?._id
                || null;
            select(next);
        }
    }, [refresh, selectedId, list.data, select]);

    const reloadOne = useCallback(async (id: string) => {
        const item = await getUserPlatform(id);
        // merge superficial
        setList((s) => ({
            ...s,
            data: s.data.map((x) => (x._id === item._id ? { ...x, ...item } : x)),
        }));
        return item;
    }, []);

    return {
        // state
        list: list.data,
        loading: list.loading,
        error: list.error,
        selected,
        selectedId,

        // selectors
        hasAny: list.data.length > 0,
        defaultOne: list.data.find((r) => r.isDefault) || null,

        // actions
        refresh,
        select,
        create,
        setDefault,
        patchStatus,
        patch,
        remove,
        reloadOne,
    };
}