// src/modules/users/pages/ClientProfilePage.tsx
import * as React from "react";
import { Box, Grid, Typography } from "@mui/material";
import ProfileForm from "@/modules/users/components/ProfileForm";
import ChangePasswordForm from "@/modules/auth/components/ChangePasswordForm";

export default function ClientProfilePage() {
    // altura objetivo para que ambos paneles coincidan (ajústala si necesitas)
    const PANEL_MIN_H = 520;

    return (
        <Box
            component="main"
            sx={{
                px: { xs: 2, sm: 3 },
                py: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Typography variant="h5" fontWeight={800} sx={{ mb: 2, width: "100%", maxWidth: 1200 }}>
                My Profile
            </Typography>

            <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="stretch"              // <- fuerza columnas a misma altura
                sx={{ width: "100%", maxWidth: 1200 }}
            >
                {/* Columna izquierda */}
                <Grid item xs={12} md={6} lg={5}
                      sx={{ display: "flex" }}        // <- permite que el wrapper llene la altura
                >
                    <Box
                        sx={{
                            width: "100%",
                            minHeight: PANEL_MIN_H,       // <- igualamos altura mínima
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <ProfileForm />
                    </Box>
                </Grid>

                {/* Columna derecha */}
                <Grid item xs={12} md={6} lg={5}
                      sx={{ display: "flex" }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            minHeight: PANEL_MIN_H,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <ChangePasswordForm />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}