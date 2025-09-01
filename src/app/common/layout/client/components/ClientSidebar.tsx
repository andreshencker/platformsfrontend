// src/app/common/layout/client/components/ClientSidebar.tsx
import * as React from "react";
import { Drawer, Toolbar, Box, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { useApp } from "@/app/context/AppContext";
import { getPlatformNavByDbId } from "@/app/common/layout/client/clientNav";
import ClientUserPanel from "./ClientUserPanel";

type Props = { open: boolean; onClose: () => void; desktop: boolean; headerH: number; drawerW: number };

export default function ClientSidebar({ open, onClose, desktop, headerH, drawerW }: Props) {
    const { platformId } = useApp();
    const navCfg = getPlatformNavByDbId(platformId);
    const { pathname } = useLocation();

    const content = (
        <Box sx={{ width: drawerW, display: "flex", flexDirection: "column" }}>
            <Toolbar sx={{ minHeight: headerH }} />
            <Box sx={{ px: 1.5, pb: 1.5, display: "grid", gap: 1.5 }}>
                <ClientUserPanel size="sm" showLabels />
                <List
                    dense
                    subheader={<ListSubheader disableSticky sx={{ bgcolor: "transparent", color: "text.secondary" }}>Navigation</ListSubheader>}
                    sx={{ mt: 0.5 }}
                >
                    {navCfg?.sideNav.map((it) => {
                        const Icon = it.icon;
                        const active = pathname.startsWith(it.path);
                        return (
                            <ListItemButton
                                key={it.path}
                                component={NavLink as any}
                                to={it.path}
                                selected={active}
                                onClick={!desktop ? onClose : undefined}
                                sx={{ mx: .5, mb: .5, borderRadius: 1.5 }}
                            >
                                <ListItemIcon sx={{ minWidth: 34 }}><Icon fontSize="small" /></ListItemIcon>
                                <ListItemText primary={it.label} />
                            </ListItemButton>
                        );
                    })}
                </List>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            {/* aquí tu botón de Sign out */}
        </Box>
    );

    const paperSx = {
        width: drawerW,
        boxSizing: "border-box" as const,
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
    };

    return desktop ? (
        <Drawer variant="persistent" open={open} sx={{ "& .MuiDrawer-paper": paperSx }}>
            {content}
        </Drawer>
    ) : (
        <Drawer variant="temporary" open={open} onClose={onClose} ModalProps={{ keepMounted: true }} sx={{ "& .MuiDrawer-paper": paperSx }}>
            {content}
        </Drawer>
    );
}