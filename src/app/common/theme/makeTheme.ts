// src/app/common/theme/makeTheme.ts
import { createTheme, PaletteMode } from "@mui/material";
import type { BrandTokens } from "./tokens";

export const makeTheme = (mode: PaletteMode, t: BrandTokens) => {
    return createTheme({
        palette: {
            mode,
            primary: { main: t.primary, contrastText: "#111214" },
            success: { main: t.success },
            warning: { main: t.warning },
            error:   { main: t.danger },
            info:    { main: t.info },
            background: { default: t.bg, paper: t.panel },
            text: { primary: t.text, secondary: t.textMuted },
            divider: t.divider,
        },
        shape: { borderRadius: 10 },
        typography: {
            fontFamily: [
                "Inter",
                "system-ui",
                "-apple-system",
                "Segoe UI",
                "Roboto",
                "Helvetica Neue",
                "Arial",
                "Noto Sans",
                "Apple Color Emoji",
                "Segoe UI Emoji",
                "Segoe UI Symbol",
                "Noto Color Emoji",
                "sans-serif",
            ].join(","),
            h1: { fontWeight: 800, fontSize: 42, lineHeight: 1.15, color: t.textStrong },
            h2: { fontWeight: 800, fontSize: 28, lineHeight: 1.2,  color: t.textStrong },
            h3: { fontWeight: 700, fontSize: 18, lineHeight: 1.3,  color: t.textStrong },
        },
        components: {
            // AppBar estilo “panel” oscuro y sin sombra
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: mode === "dark" ? "#111214" : "#0f1115",
                        borderBottom: `1px solid ${t.divider}`,
                        boxShadow: "none",
                    },
                },
            },
            // Drawer / Paper con borde tenue
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: "none",
                        border: `1px solid ${t.divider}`,
                    },
                },
            },
            // Botones
            MuiButton: {
                defaultProps: { disableElevation: true },
                styleOverrides: {
                    outlined: {
                        borderColor: t.divider,
                        background: t.surface,
                        "&:hover": { background: t.surface2 },
                    },
                    containedPrimary: {
                        boxShadow: "0 8px 26px rgba(240,185,11,.25)",
                    },
                },
            },
            // Inputs tipo “pill” y oscuros (también en light)
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        background: mode === "dark" ? t.surface : "#111827",
                        "& fieldset": { borderColor: t.divider },
                        "&:hover fieldset": { borderColor: t.ring },
                        "&.Mui-focused fieldset": { borderColor: t.ring, boxShadow: `0 0 0 2px ${t.ring}` },
                    },
                    input: { height: 24 },
                },
            },
            MuiTextField: {
                defaultProps: { size: "small" },
            },
            // List items con selección suave
            MuiListItemButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        "&.Mui-selected": {
                            background: mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(17,17,17,0.06)",
                        },
                    },
                },
            },
            // Chips / Badges suaves
            MuiChip: {
                styleOverrides: {
                    root: { borderRadius: 999 },
                    colorWarning: { background: "rgba(240,185,11,0.12)" },
                    colorSuccess: { background: "rgba(34,197,94,0.12)" },
                    colorError:   { background: "rgba(240,61,61,0.12)" },
                    colorInfo:    { background: "rgba(96,165,250,0.12)" },
                },
            },
        },
    });
};