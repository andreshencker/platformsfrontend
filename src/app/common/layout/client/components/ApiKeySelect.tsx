import * as React from "react";
import { FormControl, Select, MenuItem, Typography } from "@mui/material";
import { useApp } from "@/app/context/AppContext";
import { listBinanceAccounts } from "@/modules/integrations/binance/api/binanceAccounts";

type BinanceAccountRow = {
    _id: string;
    description?: string;
};

export default function ApiKeySelect({ compact = false }: { compact?: boolean }) {
    const { connectionType, userPlatformId, binanceAccountId, setBinanceAccountId } = useApp();
    const [items, setItems] = React.useState<BinanceAccountRow[]>([]);
    const [loading, setLoading] = React.useState(false);

    const visible = (connectionType ?? "").toLowerCase() === "apikey";

    React.useEffect(() => {
        if (!visible || !userPlatformId) return;
        let alive = true;
        (async () => {
            setLoading(true);
            try {
                const rows = await listBinanceAccounts({ userPlatformId });
                if (!alive) return;
                setItems(Array.isArray(rows) ? rows : []);
            } finally {
                setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [visible, userPlatformId]);

    if (!visible) return null;

    return (
        <FormControl size="small" sx={{ minWidth: compact ? 100 : 160 }}>
            <Select
                value={binanceAccountId ?? ""}
                disabled={loading || !items.length}
                onChange={(e) => setBinanceAccountId(String(e.target.value) || null)}
                renderValue={(val) => {
                    const row = items.find(a => a._id === val);
                    return <Typography variant="body2">{row?.description || "principal"}</Typography>;
                }}
            >
                {items.map(it => (
                    <MenuItem key={it._id} value={it._id}>
                        {it.description || "principal"}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}