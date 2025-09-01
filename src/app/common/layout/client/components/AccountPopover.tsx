import * as React from "react";
import {
    Avatar as MuiAvatar,
    Box,
    Button,
    Chip,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Popover,
    Stack,
    Typography,
} from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";

import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useApp } from "@/app/context/AppContext";
import { listBinanceAccounts } from "@/modules/integrations/binance/api/binanceAccounts";

import AvatarBlock from "./Avatar";
import PlatformSelect from "./PlatformSelect";

/** Props que recibe el popover desde el navbar */
type AccountPopoverProps = {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;

    // opcional: acciones externas
    onManagePlatforms?: () => void;  // ← abre tu pantalla de integraciones
    onSignOut?: () => void;          // ← cierra sesión
};

type BinanceAccountRow = {
    _id: string;
    description?: string;
    isDefault?: boolean;
    isActive?: boolean;
};

export default function AccountPopover({
                                           anchorEl,
                                           open,
                                           onClose,
                                           onManagePlatforms,
                                           onSignOut,
                                       }: AccountPopoverProps) {
    const { user } = useAuth();
    const { connectionType, userPlatformId, binanceAccountId } = useApp();

    const showApiKeys = (connectionType ?? "").toLowerCase() === "apikey";

    // ---- carga de API Keys (solo si aplica) ----
    const [loadingKeys, setLoadingKeys] = React.useState(false);
    const [keys, setKeys] = React.useState<BinanceAccountRow[]>([]);

    React.useEffect(() => {
        if (!showApiKeys || !userPlatformId) {
            setKeys([]);
            return;
        }
        let alive = true;
        (async () => {
            setLoadingKeys(true);
            try {
                const rows = await listBinanceAccounts({ userPlatformId } as any);
                if (!alive) return;
                setKeys(Array.isArray(rows) ? rows : []);
            } finally {
                setLoadingKeys(false);
            }
        })();
        return () => { alive = false; };
    }, [showApiKeys, userPlatformId]);

    const initials =
        [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join("") ||
        (user?.firstName?.[0] ?? "U");

    // ---- layout del popover estilo “account switcher” ----
    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
                sx: (theme) => ({
                    width: 380,
                    maxWidth: "calc(100vw - 24px)",
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "background.paper",
                    border: 1,
                    borderColor: "divider",
                    boxShadow: theme.shadows[10],
                }),
            }}
        >
            {/* Cabecera: avatar CENTRADO + PlatformSelect a la derecha */}
            <Box
                sx={(theme) => ({
                    px: 2,
                    pt: 2,
                    pb: 1.5,
                    background:
                        theme.palette.mode === "dark"
                            ? "linear-gradient(180deg, rgba(0,0,0,.25), rgba(0,0,0,0))"
                            : "linear-gradient(180deg, rgba(0,0,0,.06), rgba(0,0,0,0))",
                })}
            >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    {/* Avatar grande, estilo circular */}
                    <Box sx={{ flex: "0 0 auto" }}>
                        <MuiAvatar
                            sx={{ width: 72, height: 72, fontWeight: 700 }}
                            src={(user as any)?.avatarUrl || (user as any)?.imageUrl || ""}
                        >
                            {initials}
                        </MuiAvatar>
                    </Box>

                    {/* A la derecha, platform select “full” */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        {/* Nombre arriba */}
                        <Typography variant="subtitle1" fontWeight={800} noWrap>
                            {[user?.firstName, user?.lastName].filter(Boolean).join(" ") || "User"}
                        </Typography>
                        {/* Correo (wrap controlado) */}
                        {user?.email && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                noWrap
                                title={user.email}
                            >
                                {user.email}
                            </Typography>
                        )}

                        {/* Select de plataforma (full) alineado con el header */}
                        <Box sx={{ mt: 1 }}>
                            <PlatformSelect /* etiqueta oculta; muestra logo+nombre */
                                variant="full"
                            />
                        </Box>
                    </Box>
                </Stack>
            </Box>

            <Divider />

            {/* Botón de gestión de plataformas */}
            <Box sx={{ px: 2, py: 1.5 }}>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={onManagePlatforms}
                    endIcon={<OpenInNewRoundedIcon />}
                    sx={{
                        borderRadius: 1.5,
                        fontWeight: 700,
                    }}
                >
                    Manage platforms
                </Button>
            </Box>

            {/* Lista de API Keys (solo si connectionType === 'apikey') */}
            {showApiKeys && (
                <>
                    <Divider />
                    <Box sx={{ px: 2, py: 1 }}>
                        <Typography
                            variant="overline"
                            color="text.secondary"
                            sx={{ letterSpacing: 0.6 }}
                        >
                            API Keys
                        </Typography>
                    </Box>

                    <List dense disablePadding sx={{ px: 1, pb: 1 }}>
                        {loadingKeys && (
                            <ListItem sx={{ px: 1.5 }}>
                                <ListItemText primary="Loading..." />
                            </ListItem>
                        )}

                        {!loadingKeys && keys.length === 0 && (
                            <ListItem sx={{ px: 1.5 }}>
                                <ListItemText
                                    primary="No API keys"
                                    secondary="Add one from Integrations"
                                />
                            </ListItem>
                        )}

                        {keys.map((k) => {
                            const isActive = k._id === binanceAccountId;
                            return (
                                <ListItem
                                    key={k._id}
                                    sx={(theme) => ({
                                        mx: 1,
                                        mb: 1,
                                        borderRadius: 1.5,
                                        border: 1,
                                        px: 1,
                                        py: 0.75,
                                        alignItems: "center",
                                        gap: 1,
                                        borderColor: isActive
                                            ? "primary.light"
                                            : theme.palette.divider,
                                        background:
                                            theme.palette.mode === "dark"
                                                ? "rgba(255,255,255,0.02)"
                                                : "rgba(0,0,0,0.02)",
                                    })}
                                >
                                    <ListItemAvatar sx={{ minWidth: 40 }}>
                                        <MuiAvatar sx={{ width: 26, height: 26 }}>
                                            {k.description?.[0]?.toUpperCase() || "K"}
                                        </MuiAvatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={k.description || "principal"}
                                        primaryTypographyProps={{ fontSize: 14, fontWeight: 700 }}
                                        secondaryTypographyProps={{ fontSize: 12 }}
                                        secondary={
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                {k.isDefault && (
                                                    <Chip
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                        label="Default"
                                                    />
                                                )}
                                                {k.isActive && (
                                                    <Chip
                                                        size="small"
                                                        color="success"
                                                        variant="outlined"
                                                        icon={<VerifiedRoundedIcon fontSize="small" />}
                                                        label="Active"
                                                    />
                                                )}
                                            </Stack>
                                        }
                                    />

                                    {/* Podrías poner aquí un botón para setear como activa, etc. */}
                                </ListItem>
                            );
                        })}
                    </List>
                </>
            )}

            {/* Pie: acciones rápidas */}
            <Divider />
            <Box
                sx={{
                    px: 1,
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                }}
            >
                <Button
                    size="small"
                    color="inherit"
                    onClick={onClose}
                    sx={{ borderRadius: 1.5 }}
                >
                    Close
                </Button>

                {onSignOut && (
                    <Button
                        size="small"
                        color="inherit"
                        onClick={onSignOut}
                        startIcon={<LogoutRoundedIcon />}
                        sx={{ borderRadius: 1.5 }}
                    >
                        Sign out
                    </Button>
                )}
            </Box>
        </Popover>
    );
}