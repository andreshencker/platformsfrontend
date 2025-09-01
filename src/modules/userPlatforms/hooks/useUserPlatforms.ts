import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
    listUserPlatforms,
    getUserPlatformById,
    createUserPlatform,
    setDefaultUserPlatform,
    changeUserPlatformStatus,
    updateUserPlatform,
    removeUserPlatform,
    type UserPlatform,
    type CreateUserPlatformBody,
    type UserPlatformStatus,
} from "@/modules/userPlatforms/api/userPlatforms";

import { useApp } from "@/app/context/AppContext"; // <- tu AppContext

// Estado asíncrono local
type AsyncState<T> = {
    data: T;
    loading: boolean;
    error: string | null;
};

/**
 * NOTA sobre tipos:
 * - En tu API `UserPlatform` no trae `connectionType`, pero en tu backend mencionaste que existe.
 *   Si lo tienes, puedes extenderlo aquí como opcional para setear AppContext.
 */
type MaybeWithConn = UserPlatform & { connectionType?: string };

export function useUserPlatforms() {
    const {
        userPlatformId,                // seleccionado global (AppContext)
        setUserPlatformId,
        setPlatformId,
        setConnectionType,
    } = useApp();

    const [list, setList] = useState<AsyncState<MaybeWithConn[]>>({
        data: [],
        loading: true,
        error: null,
    });

    const extractError = (e: any) =>
        e?.response?.data?.message || e?.message || "Unexpected error";

    // ---- Carga de lista + reconciliación con AppContext ----
    const refresh = useCallback(async () => {
        setList((s) => ({ ...s, loading: true, error: null }));
        try {
            const rows = (await listUserPlatforms()) as MaybeWithConn[];
            setList({ data: rows, loading: false, error: null });

            // Si no hay uno seleccionado en AppContext, escoger default o primero
            if (!userPlatformId) {
                const def = rows.find((r) => r.isDefault);
                const pick = def?._id || rows[0]?._id || null;
                if (pick) {
                    // propagar a AppContext (y derivar platform/connectionType)
                    const row = rows.find((r) => r._id === pick)!;
                    setUserPlatformId(pick);
                    setPlatformId(row.platformId ?? null);
                    setConnectionType(row.connectionType ?? null);
                }
            } else {
                // Si el seleccionado ya no existe, corregirlo
                const exists = rows.some((r) => r._id === userPlatformId);
                if (!exists) {
                    const def = rows.find((r) => r.isDefault);
                    const pick = def?._id || rows[0]?._id || null;
                    setUserPlatformId(pick ?? null);
                    const row = rows.find((r) => r._id === (pick ?? "")) || null;
                    setPlatformId(row?.platformId ?? null);
                    setConnectionType(row?.connectionType ?? null);
                }
            }
        } catch (e: any) {
            setList((s) => ({ ...s, loading: false, error: extractError(e) }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userPlatformId]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    // Seleccionado “concreto” (fila)
    const selected = useMemo(
        () => list.data.find((x) => x._id === userPlatformId) || null,
        [list.data, userPlatformId]
    );

    // ---- Actions ----
    const select = useCallback(
        (id: string | null) => {
            setUserPlatformId(id);
            const row = id ? list.data.find((r) => r._id === id) || null : null;
            setPlatformId(row?.platformId ?? null);
            setConnectionType(row?.connectionType ?? null);
        },
        [list.data, setUserPlatformId, setPlatformId, setConnectionType]
    );

    const create = useCallback(
        async (dto: CreateUserPlatformBody) => {
            try {
                const created = (await createUserPlatform(dto)) as MaybeWithConn;
                await refresh();

                // Si el backend lo marcó default, o no había default previo, seleccionalo
                const hadDefault = list.data.some((r) => r.isDefault);
                if (created.isDefault || !hadDefault) {
                    select(created._id);
                }
                toast.success("Plataforma creada");
                return created;
            } catch (e: any) {
                toast.error(extractError(e));
                throw e;
            }
        },
        [list.data, refresh, select]
    );

    const setDefault = useCallback(
        async (id: string) => {
            try {
                await setDefaultUserPlatform(id);
                await refresh();
                select(id); // sincroniza AppContext
                toast.success("Predeterminada actualizada");
            } catch (e: any) {
                toast.error(extractError(e));
                throw e;
            }
        },
        [refresh, select]
    );

    const patchStatus = useCallback(
        async (id: string, status: UserPlatformStatus) => {
            try {
                const updated = (await changeUserPlatformStatus(id, status)) as MaybeWithConn;
                await refresh();
                toast.success("Estado actualizado");
                return updated;
            } catch (e: any) {
                toast.error(extractError(e));
                throw e;
            }
        },
        [refresh]
    );

    const patch = useCallback(
        async (id: string, payload: Partial<Pick<UserPlatform, "isActive" | "isDefault">>) => {
            try {
                const updated = (await updateUserPlatform(id, payload)) as MaybeWithConn;
                await refresh();
                toast.success("Plataforma actualizada");
                return updated;
            } catch (e: any) {
                toast.error(extractError(e));
                throw e;
            }
        },
        [refresh]
    );

    const remove = useCallback(
        async (id: string) => {
            try {
                await removeUserPlatform(id);
                await refresh();

                // Si borraste el seleccionado, elige otro (default o primero)
                if (userPlatformId === id) {
                    const remaining = list.data.filter((r) => r._id !== id);
                    const def = remaining.find((r) => r.isDefault);
                    const pick = def?._id || remaining[0]?._id || null;
                    select(pick);
                }
                toast.success("Plataforma eliminada");
            } catch (e: any) {
                toast.error(extractError(e));
                throw e;
            }
        },
        [list.data, refresh, select, userPlatformId]
    );

    const reloadOne = useCallback(async (id: string) => {
        const item = (await getUserPlatformById(id)) as MaybeWithConn;
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
        selectedId: userPlatformId,

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