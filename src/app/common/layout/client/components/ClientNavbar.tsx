// src/app/common/layout/client/components/ClientNavbar.tsx
import * as React from "react";
import { AppBar, Box, IconButton, Toolbar, Typography, Button } from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { useApp } from "@/app/context/AppContext";
import { getPlatformNavByDbId } from "@/app/common/layout/client/clientNav";
import { NavLink, useLocation } from "react-router-dom";

type Props = { onToggleSidebar: () => void; headerH: number };

export default function ClientNavbar({ onToggleSidebar, headerH }: Props) {
    const { platformId } = useApp();
    const navCfg = getPlatformNavByDbId(platformId);
    const { pathname } = useLocation();

    return (
        <AppBar position="fixed" sx={{ height: headerH, justifyContent: "center", zIndex: t => t.zIndex.drawer + 1 }}>
            <Toolbar sx={{ minHeight: headerH, gap: 1 }}>
                <IconButton onClick={onToggleSidebar} size="small" sx={{
                    width: 34, height: 34, borderRadius: 1.5, bgcolor: "background.paper", border: t => `1px solid ${t.palette.divider}`,
                    color: "text.primary", "&:hover": { bgcolor: "background.paper" },
                }}>
                    <MenuRoundedIcon fontSize="small" />
                </IconButton>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 18, height: 18, borderRadius: 1, bgcolor: "primary.main" }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Client Console</Typography>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                {/* Top nav (rutas principales) */}
                <Box sx={{ display: "flex", gap: .5 }}>
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
            </Toolbar>
        </AppBar>
    );
}