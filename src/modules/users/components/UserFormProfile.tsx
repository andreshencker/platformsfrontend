// src/app/modules/users/components/ProfileForm.tsx
import * as React from "react";
import {
    Box,
    Card,
    CardContent,
    Grid,
    Stack,
    TextField,
    Typography,
    Button,
    CircularProgress,
    useTheme,
    alpha,
} from "@mui/material";

/** Props públicas del componente */
export type ProfileFormCardProps = {
    initialValues?: {
        firstName?: string;
        middleName?: string;
        lastName?: string;
        secondLastName?: string;
    };
    loading?: boolean;                        // ← estado de envío
    onSubmit: (values: {
        firstName: string;
        middleName: string;
        lastName: string;
        secondLastName: string;
    }) => Promise<void> | void;
};

/** 🔶 Card estilo "Sign in" (oscura con glow amarillo) para editar perfil */
export default function ProfileFormCard({
                                            initialValues,
                                            loading = false,
                                            onSubmit,
                                        }: ProfileFormCardProps) {
    const theme = useTheme();

    // 📝 estado local del formulario
    const [values, setValues] = React.useState({
        firstName: initialValues?.firstName ?? "",
        middleName: initialValues?.middleName ?? "",
        lastName: initialValues?.lastName ?? "",
        secondLastName: initialValues?.secondLastName ?? "",
    });

    // 🔁 sincroniza si cambian initialValues (p.ej. al terminar de cargar)
    React.useEffect(() => {
        setValues({
            firstName: initialValues?.firstName ?? "",
            middleName: initialValues?.middleName ?? "",
            lastName: initialValues?.lastName ?? "",
            secondLastName: initialValues?.secondLastName ?? "",
        });
    }, [
        initialValues?.firstName,
        initialValues?.middleName,
        initialValues?.lastName,
        initialValues?.secondLastName,
    ]);

    // 🎨 estilos: card oscura con glow suave tipo login
    const glow = `0 18px 50px ${alpha(theme.palette.warning.main, 0.2)}`;
    const cardBg =
        theme.palette.mode === "dark"
            ? `linear-gradient(180deg, ${alpha(theme.palette.common.black, 0.35)} 0%, ${alpha(
                theme.palette.background.paper,
                0.95
            )} 100%)`
            : theme.palette.background.paper;

    // ✅ envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(values);
    };

    return (
        <Card
            variant="outlined"
            sx={{
                maxWidth: 720,
                mx: "auto",
                borderRadius: 2, // un poco más suave para imitar el login
                borderColor:
                    theme.palette.mode === "dark" ? theme.palette.grey[800] : "divider",
                background: cardBg,
                position: "relative",
                overflow: "hidden",
                boxShadow: theme.palette.mode === "dark" ? glow : "none",
            }}
        >
            {/* Capa de halo superior muy sutil (como el login hero) */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    background:
                        theme.palette.mode === "dark"
                            ? `radial-gradient(1200px 280px at 80% -40%, ${alpha(
                                theme.palette.warning.main,
                                0.12
                            )} 0%, transparent 60%)`
                            : "none",
                }}
            />

            <CardContent sx={{ p: 3 }}>
                {/* Encabezado: título + pequeña descripción como en el login */}
                <Stack spacing={0.5} sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight={800}>
                        Edit your profile
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Update your personal information below.
                    </Typography>
                </Stack>

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={1.5}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                value={values.firstName}
                                onChange={(e) =>
                                    setValues((s) => ({ ...s, firstName: e.target.value }))
                                }
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Middle Name"
                                value={values.middleName}
                                onChange={(e) =>
                                    setValues((s) => ({ ...s, middleName: e.target.value }))
                                }
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                value={values.lastName}
                                onChange={(e) =>
                                    setValues((s) => ({ ...s, lastName: e.target.value }))
                                }
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Second Last Name"
                                value={values.secondLastName}
                                onChange={(e) =>
                                    setValues((s) => ({
                                        ...s,
                                        secondLastName: e.target.value,
                                    }))
                                }
                            />
                        </Grid>

                        {/* Botón alineado como el login (ancho ajustado, glow suave) */}
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="warning" // mismo acento cálido del login
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={18} /> : null}
                                sx={{
                                    mt: 0.5,
                                    borderRadius: 1.5,
                                    px: 2.5,
                                    boxShadow:
                                        theme.palette.mode === "dark"
                                            ? `0 12px 40px ${alpha(theme.palette.warning.main, 0.3)}`
                                            : undefined,
                                }}
                            >
                                {loading ? "Saving…" : "Save changes"}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    );
}