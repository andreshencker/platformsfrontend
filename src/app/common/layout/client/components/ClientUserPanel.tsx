import * as React from "react";
import { Box, Paper, Stack } from "@mui/material";
import AvatarBlock from "./Avatar";
import PlatformSelect from "./PlatformSelect";
import ApiKeySelect from "./ApiKeySelect";

export default function ClientUserPanel() {
    return (
        <Paper
            variant="outlined"
            sx={(theme) => ({
                p: 1.5,
                borderRadius: 2,
                background: `linear-gradient(to bottom, ${theme.palette.background.paper}, ${theme.palette.mode === "dark"
                    ? "rgba(240,185,11,0.08)" : "rgba(240,185,11,0.15)"})`,
                boxShadow: theme.shadows[6],
                display: "grid",
                gap: 1.5,
            })}
        >
            <AvatarBlock variant="sidebar" size={36} showName />

            {/* Selects en fila */}
            <Stack direction="row" spacing={1.25}>
                <PlatformSelect variant="logo" />
                <ApiKeySelect compact />
            </Stack>
        </Paper>
    );
}