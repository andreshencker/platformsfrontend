// src/app/common/layout/client/components/AccountPopover.tsx
import * as React from "react";
import {
    Box,
    Button,
    Divider,
    Popover,
    Stack,
    Typography,
} from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useApp } from "@/app/context/AppContext";

import Avatar from "./Avatar";           // ✅ tu componente de avatar
import PlatformSelect from "./PlatformSelect";
import ApiKeyList from "./ApiKeyList";   // ✅ usamos este y NO ApiKeySelect

type AccountPopoverProps = {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    onManagePlatforms?: () => void;
    onSignOut?: () => void;
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
            {/* 1) Header: SOLO avatar + nombre/correo */}
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
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar size={72} /> {/* ✅ avatar único */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" fontWeight={800} noWrap>
                            {[user?.firstName, user?.lastName].filter(Boolean).join(" ") || "User"}
                        </Typography>
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
                    </Box>
                </Stack>
            </Box>

            <Divider />

            {/* 2) Plataforma: PlatformSelect SIN avatar/label + botón */}
            <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
                <PlatformSelect
                    variant="full"
                    showAvatar={false} // ✅ ocultamos avatar del selector
                    showLabel={false}  // ✅ oculta label "Platform" si lo trae
                />
                <Box sx={{ mt: 1.5 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={onManagePlatforms}
                        endIcon={<OpenInNewRoundedIcon />}
                        sx={{ borderRadius: 1.5, fontWeight: 700 }}
                    >
                        Manage platforms
                    </Button>
                </Box>
            </Box>

            {/* 3) API Keys (usa ApiKeyList) */}
            {showApiKeys && (
                <>
                    <Divider />
                    <ApiKeyList
                        userPlatformId={userPlatformId}
                        selectedId={binanceAccountId}
                        sx={{ px: 2, py: 1 }}
                    />
                </>
            )}

            {/* 4) Footer */}
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
                <Button size="small" color="inherit" onClick={onClose} sx={{ borderRadius: 1.5 }}>
                    Close
                </Button>

                {onSignOut && (
                    <Button
                        size="small"
                        color="inherit"
                        onClick={onSignOut}
                        sx={{ borderRadius: 1.5 }}
                    >
                        Sign out
                    </Button>
                )}
            </Box>
        </Popover>
    );
}