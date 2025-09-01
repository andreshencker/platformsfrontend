import * as React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import ClientNavbar from "./components/ClientNavbar";
import ClientSidebar from "./components/ClientSidebar";

export default function ClientLayout() {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("lg")); // ~1024px
    const HEADER_H = 56;
    const DRAWER_W = 248;

    const [open, setOpen] = React.useState(false);
    const { pathname } = useLocation();

    React.useEffect(() => {
        setOpen(isDesktop); // desktop => abierto; mobile => cerrado
    }, [isDesktop]);

    React.useEffect(() => {
        if (!isDesktop) setOpen(false); // cerrar en mobile al navegar
    }, [pathname, isDesktop]);

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                bgcolor: "background.default",
                color: "text.primary",
            }}
        >
            <ClientNavbar
                onToggleSidebar={() => setOpen((v) => !v)}
                headerH={HEADER_H}
            />

            <ClientSidebar
                open={open}
                onClose={() => setOpen(false)}
                desktop={isDesktop}
                headerH={HEADER_H}
                drawerW={DRAWER_W}
            />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    pt: `${HEADER_H}px`,
                    pl: { lg: open ? `${DRAWER_W}px` : 0 },
                    transition: (t) =>
                        t.transitions.create("padding-left", {
                            duration: t.transitions.duration.shorter,
                        }),
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}