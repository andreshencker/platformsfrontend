// src/app/common/layout/client/components/ApiKeyList.tsx
import * as React from "react";
import {
    Box,
    Chip,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography,
} from "@mui/material";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import { listBinanceAccounts } from "@/modules/integrations/binance/binanceAccount/api/binanceAccounts";

type BinanceAccountRow = {
    _id: string;
    description?: string;
    isDefault?: boolean;
    isActive?: boolean;
};

type ApiKeyListProps = {
    userPlatformId?: string | null;
    selectedId?: string | null;
    onSelect?: (id: string) => void; // opcional si luego quieres hacerlo seleccionable
    sx?: any;
};

export default function ApiKeyList({
                                       userPlatformId,
                                       selectedId,
                                       onSelect,
                                       sx,
                                   }: ApiKeyListProps) {
    const [loading, setLoading] = React.useState(false);
    const [rows, setRows] = React.useState<BinanceAccountRow[]>([]);

    React.useEffect(() => {
        let alive = true;
        async function load() {
            if (!userPlatformId) {
                setRows([]);
                return;
            }
            setLoading(true);
            try {
                const res = await listBinanceAccounts({ userPlatformId } as any);
                if (!alive) return;
                setRows(Array.isArray(res) ? res : []);
            } finally {
                if (alive) setLoading(false);
            }
        }
        load();
        return () => { alive = false; };
    }, [userPlatformId]);

    return (
        <Box sx={{ px: 2, py: 1, ...sx }}>
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.6 }}>
                API Keys
            </Typography>

            <List dense disablePadding sx={{ mt: 0.5 }}>
                {loading && (
                    <ListItem sx={{ px: 1 }}>
                        <ListItemText primary="Loading..." />
                    </ListItem>
                )}

                {!loading && rows.length === 0 && (
                    <ListItem sx={{ px: 1 }}>
                        <ListItemText primary="No API keys" secondary="Add one from Integrations" />
                    </ListItem>
                )}

                {rows.map((k) => {
                    const isActive = k._id === selectedId;
                    return (
                        <ListItem
                            key={k._id}
                            button={Boolean(onSelect) as any}
                            onClick={onSelect ? () => onSelect(k._id) : undefined}
                            sx={(theme) => ({
                                mx: 0,
                                mb: 1,
                                borderRadius: 1.5,
                                border: 1,
                                px: 1,
                                py: 0.75,
                                alignItems: "center",
                                gap: 1,
                                borderColor: isActive ? "primary.light" : theme.palette.divider,
                                background:
                                    theme.palette.mode === "dark"
                                        ? "rgba(255,255,255,0.02)"
                                        : "rgba(0,0,0,0.02)",
                                "&:hover": onSelect
                                    ? {
                                        background:
                                            theme.palette.mode === "dark"
                                                ? "rgba(255,255,255,0.04)"
                                                : "rgba(0,0,0,0.04)",
                                    }
                                    : undefined,
                            })}
                        >
                            <ListItemAvatar sx={{ minWidth: 40 }}>
                                <Avatar sx={{ width: 26, height: 26 }}>
                                    {k.description?.[0]?.toUpperCase() || "K"}
                                </Avatar>
                            </ListItemAvatar>

                            <ListItemText
                                primary={k.description || "principal"}
                                primaryTypographyProps={{ fontSize: 14, fontWeight: 700 }}
                                secondaryTypographyProps={{ fontSize: 12 }}
                                secondary={
                                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                        {k.isDefault && <Chip size="small" color="primary" variant="outlined" label="Default" />}
                                        {k.isActive && (
                                            <Chip
                                                size="small"
                                                color="success"
                                                variant="outlined"
                                                icon={<VerifiedRoundedIcon fontSize="small" />}
                                                label="Active"
                                            />
                                        )}
                                    </Box>
                                }
                            />
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
}