// src/app/common/layout/client/components/ClientNavbar.tsx
import * as React from "react";
import {
    AppBar,
    Box,
    IconButton,
    Toolbar,
    Typography,
    Button,
    ButtonBase,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { useApp } from "@/app/context/AppContext";
import { getPlatformNavByDbId } from "@/app/common/layout/client/clientNav";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import AccountPopover from "./AccountPopover"; // ⬅️ el popover de cuenta

type Props = { onToggleSidebar: () => void; headerH: number };

export default function ClientNavbar({ onToggleSidebar, headerH }: Props) {
    const { platformId } = useApp();
    const navCfg = getPlatformNavByDbId(platformId);
    const { pathname } = useLocation();

    // popover de cuenta
    const { logout, user } = useAuth();
    const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
    const navigate = useNavigate();

    const openAccount = (e: React.MouseEvent<HTMLElement>) =>
        setAnchor(e.currentTarget);
    const closeAccount = () => setAnchor(null);

    const goManagePlatforms = () => {
        closeAccount();
        navigate("/client/settings#integrations");
    };

    const handleSignOut = async () => {
        closeAccount();
        await logout();
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                height: headerH,
                justifyContent: "center",
                zIndex: (t) => t.zIndex.drawer + 1,
            }}
        >
            <Toolbar sx={{ minHeight: headerH, gap: 1 }}>
                {/* Burger (si todavía lo usas) */}
                <IconButton
                    onClick={onToggleSidebar}
                    size="small"
                    sx={{
                        width: 34,
                        height: 34,
                        borderRadius: 1.5,
                        bgcolor: "background.paper",
                        border: (t) => `1px solid ${t.palette.divider}`,
                        color: "text.primary",
                        "&:hover": { bgcolor: "background.paper" },
                    }}
                    aria-label="open menu"
                >
                    <MenuRoundedIcon fontSize="small" />
                </IconButton>

                {/* Brand (Jtrade) */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 18, height: 18, borderRadius: 1, bgcolor: "primary.main" }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Jtrade
                    </Typography>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                {/* Top nav (rutas principales) */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 0.5,
                        mr: 1,
                        // en pantallas chicas puedes ocultar texto y dejar sólo iconos si quieres
                    }}
                >
                    {navCfg?.topNav.map((it) => {
                        const active = pathname.startsWith(it.path);
                        const Icon = it.icon;
                        return (
                            <Button
                                key={it.path}
                                component={NavLink as any}
                                to={it.path}
                                size="small"
                                startIcon={<Icon fontSize="small" />}
                                color={active ? "primary" : "inherit"}
                                variant={active ? "contained" : "text"}
                                sx={{ borderRadius: 1.5, textTransform: "none" }}
                            >
                                {it.label}
                            </Button>
                        );
                    })}
                </Box>

                {/* Botón de cuenta (abre popover estilo Google) */}
                <ButtonBase
                    onClick={openAccount}
                    sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1.5,
                        border: 1,
                        borderColor: "divider",
                        bgcolor: "background.paper",
                        maxWidth: 220,
                    }}
                    aria-label="open account menu"
                >
                    <Typography
                        variant="body2"
                        fontWeight={700}
                        noWrap
                        title={user?.email || "Account"}
                    >
                        {user?.email || "Account"}
                    </Typography>
                </ButtonBase>

                <AccountPopover
                    open={Boolean(anchor)}
                    anchorEl={anchor}
                    onClose={closeAccount}
                    onManagePlatforms={goManagePlatforms}
                    onSignOut={handleSignOut}
                />
            </Toolbar>
        </AppBar>
    );
}