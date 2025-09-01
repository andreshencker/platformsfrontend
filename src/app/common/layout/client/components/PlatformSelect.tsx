// src/app/common/layout/client/components/PlatformSelect.tsx
import * as React from "react";
import {
    FormControl, InputLabel, Select, MenuItem, Stack, Avatar as MuiAvatar, Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/app/context/AppContext";
import { listUserPlatforms } from "@/modules/userPlatforms/api/userPlatforms";
import { getPlatformLandingByDbId } from "@/app/common/layout/client/clientNav";

// Estructura esperada de tu API
type UserPlatformRow = {
    _id: string;              // <-- este es el valor del Select
    platformId: string;       // DB id de plataforma (igual que _id de platform en catálogo)
    connectionType?: string;
    platform?: { name?: string; imageUrl?: string };
    isDefault?: boolean;
};

export default function PlatformSelect({ label = "Platform" }: { label?: string }) {
    const nav = useNavigate();
    const { platformId, userPlatformId, setPlatformId, setUserPlatformId, setConnectionType } = useApp();

    const [items, setItems] = React.useState<UserPlatformRow[]>([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        let alive = true;
        (async () => {
            setLoading(true);
            try {
                const rows = await listUserPlatforms();
                if (!alive) return;
                setItems(Array.isArray(rows) ? rows : []);
            } finally {
                setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, []);

    // Si lo que hay en memoria/localStorage no coincide con la lista actual, selecciona default o primera
    React.useEffect(() => {
        if (!items.length) return;

        // “válida” si el userPlatformId actual existe en la lista
        const existsUP = userPlatformId && items.some(r => r._id === userPlatformId);
        if (!existsUP) {
            const fallback = items.find(r => r.isDefault) ?? items[0];
            if (fallback) {
                setUserPlatformId(fallback._id);
                setPlatformId(fallback.platformId);
                setConnectionType(fallback.connectionType ?? null);
                const to = getPlatformLandingByDbId(fallback.platformId);
                if (to) nav(to, { replace: true });
            }
        }
    }, [items, userPlatformId, setUserPlatformId, setPlatformId, setConnectionType, nav]);

    const active = React.useMemo(
        () => items.find(r => r._id === userPlatformId) ?? null,
        [items, userPlatformId]
    );

    const onChange = (nextUserPlatformId: string) => {
        const row = items.find(r => r._id === nextUserPlatformId);
        if (!row) return;

        setUserPlatformId(row._id);
        setPlatformId(row.platformId);
        setConnectionType(row.connectionType ?? null);

        const to = getPlatformLandingByDbId(row.platformId);
        if (to) nav(to, { replace: true });
    };

    return (
        <FormControl fullWidth size="small">
            {label && <InputLabel>{label}</InputLabel>}
            <Select
                label={label}
                // IMPORTANTÍSIMO: el value es el _id del UserPlatform, coincide con los <MenuItem value={_id}>
                value={active?._id ?? ""}
                disabled={loading || !items.length}
                onChange={(e) => onChange(String(e.target.value))}
                renderValue={(val) => {
                    const row = items.find(r => r._id === val);
                    return (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <MuiAvatar src={row?.platform?.imageUrl} sx={{ width: 20, height: 20 }} />
                            <Typography variant="body2">
                                {row?.platform?.name ?? "Platform"}
                            </Typography>
                        </Stack>
                    );
                }}
            >
                {items.map(it => (
                    <MenuItem key={it._id} value={it._id}>
                        <Stack direction="row" alignItems="center" spacing={1.25}>
                            <MuiAvatar src={it.platform?.imageUrl} sx={{ width: 20, height: 20 }} />
                            <Typography variant="body2">
                                {it.platform?.name ?? it.platformId}
                            </Typography>
                        </Stack>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}