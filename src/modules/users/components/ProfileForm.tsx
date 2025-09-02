import * as React from "react";
import {
    Box,
    Card,
    CardContent,
    Stack,
    Typography,
    TextField,
    Button,
    useTheme,
    alpha,
    CircularProgress,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "@/app/lib/http";
import type { User, UpdateUserDto } from "@/modules/users/types/types";

export default function ProfileForm() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const qc = useQueryClient();

    // ====== Tokens/colores coherentes con tu UI ======
    const YELLOW = "#ffd400";
    const inputBg   = isDark ? "#141422" : "#ffffff";
    const inputBr   = isDark ? "#23233a" : "#e5e7eb";
    const inputText = isDark ? "#ffffff" : "#111214";
    const placeholder = isDark ? "#ffffff66" : alpha("#111214", 0.5);

    const cardBg = isDark
        ? `radial-gradient(1200px 500px at 80% -20%, ${alpha(YELLOW, 0.09)} 0, transparent 70%), rgba(17,17,25,.66)`
        : `radial-gradient(1200px 500px at 80% -20%, ${alpha(YELLOW, 0.08)} 0, transparent 75%), #ffffff`;
    const cardBorder = isDark ? "#24243a" : theme.palette.divider;
    const cardShadow = isDark
        ? `0 30px 80px #00000055 inset, 0 10px 40px #00000055`
        : `0 12px 36px rgba(17,17,17,.06)`;

    // Quitar “amarillo” del autofill y mantener texto legible
    const autofillFix = {
        "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus": {
            WebkitBoxShadow: `0 0 0 1000px ${inputBg} inset !important`,
            WebkitTextFillColor: `${inputText} !important`,
            caretColor: inputText,
            transition: "background-color 9999s ease-out 0s",
        },
    } as const;

    // Estilo base de inputs
    const inputSx = {
        "& .MuiOutlinedInput-root": {
            backgroundColor: inputBg,
            borderRadius: "12px",
            color: inputText,
            "& fieldset": { borderColor: inputBr },
            "&:hover fieldset": { borderColor: inputBr },
            "&.Mui-focused fieldset": {
                borderColor: alpha(YELLOW, 0.6),
                boxShadow: `0 0 0 4px ${alpha(YELLOW, 0.15)}`,
            },
            "&.Mui-disabled": {
                backgroundColor: isDark ? alpha("#ffffff", 0.06) : "#f8fafc",
                color: inputText,
                "& fieldset": { borderColor: inputBr },
            },
            "& .MuiOutlinedInput-input": { height: 24, padding: "12px 14px" },
        },
        "& .MuiInputBase-input::placeholder": { color: placeholder },
        ...autofillFix,
    } as const;

    // ====== DATA: SOLO /auth/me ======
    const qMe = useQuery<User>({
        queryKey: ["me"],
        // Tu backend responde: { status, data: User }
        queryFn: async () => {
            const { data } = await api.get("/auth/me");
            const user: User | undefined = data?.data ?? data?.user ?? data;
            if (!user) throw new Error("Invalid /auth/me payload");
            return user;
        },
        retry: 0,
    });

    // Estado del form
    const [form, setForm] = React.useState<UpdateUserDto>({
        firstName: "",
        middleName: "",
        lastName: "",
        secondLastName: "",
    });

    // Prefill al cargar /auth/me
    React.useEffect(() => {
        const u = qMe.data;
        if (u?._id) {
            setForm({
                firstName: u.firstName ?? "",
                middleName: u.middleName ?? "",
                lastName: u.lastName ?? "",
                secondLastName: u.secondLastName ?? "",
            });
        }
    }, [
        qMe.data?._id,
        qMe.data?.firstName,
        qMe.data?.middleName,
        qMe.data?.lastName,
        qMe.data?.secondLastName,
    ]);

    // ====== SAVE: PATCH /users/me ======
    const mUpdate = useMutation({
        mutationFn: async (dto: UpdateUserDto) => {
            const { data } = await api.patch("/users/me", dto);
            // Puede venir {status, data} o el user plano
            return (data?.data ?? data) as User;
        },
        onSuccess: (updated) => {
            qc.setQueryData(["me"], updated);
            toast.success("Profile updated successfully");
        },
        onError: (e: any) => {
            const msg = e?.response?.data?.message || e?.message || "Could not update profile";
            toast.error(msg);
        },
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mUpdate.mutate({
            firstName: (form.firstName ?? "").trim(),
            middleName: (form.middleName ?? "").trim(),
            lastName: (form.lastName ?? "").trim(),
            secondLastName: (form.secondLastName ?? "").trim(),
        });
    };

    // ====== UI states ======
    if (qMe.isLoading) {
        return (
            <Box sx={{ display: "grid", placeItems: "center", minHeight: 220 }}>
                <CircularProgress size={24} />
            </Box>
        );
    }
    if (qMe.isError || !qMe.data) {
        return (
            <Typography color="error" align="center">
                Could not load your profile.
            </Typography>
        );
    }

    // ====== UI ======
    return (
        <Card
            variant="outlined"
            sx={{
                maxWidth: 520,
                mx: "auto",
                borderRadius: "20px",
                borderColor: cardBorder,
                background: cardBg,
                boxShadow: cardShadow,
                p: { xs: 2, sm: 3 },
            }}
        >
            <Box
                sx={{
                    display: "inline-block",
                    fontSize: 12,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    borderRadius: "999px",
                    px: 1.25,
                    py: 0.5,
                    mb: 1.5,
                    background: isDark ? "#3a3200" : alpha(YELLOW, 0.18),
                    color: YELLOW,
                    fontWeight: 800,
                    border: `1px solid ${alpha(YELLOW, 0.25)}`,
                }}
            >
                SECURE • FAST
            </Box>

            <CardContent sx={{ p: 0 }}>
                <Typography variant="h4" fontWeight={800} gutterBottom>
                    Edit Profile
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 2.5 }}>
                    Update your personal information below.
                </Typography>

                <Box component="form" onSubmit={onSubmit}>
                    <Stack spacing={1.5}>
                        {/* Email read-only con el mismo estilo visual */}
                        <TextField
                            variant="outlined"
                            placeholder="Email"
                            value={qMe.data.email}
                            fullWidth
                            sx={inputSx}
                            InputProps={{ readOnly: true }}
                            disabled
                        />

                        <TextField
                            variant="outlined"
                            placeholder="First Name"
                            value={form.firstName ?? ""}
                            onChange={(e) => setForm((s) => ({ ...s, firstName: e.target.value }))}
                            fullWidth
                            sx={inputSx}
                        />
                        <TextField
                            variant="outlined"
                            placeholder="Middle Name"
                            value={form.middleName ?? ""}
                            onChange={(e) => setForm((s) => ({ ...s, middleName: e.target.value }))}
                            fullWidth
                            sx={inputSx}
                        />
                        <TextField
                            variant="outlined"
                            placeholder="Last Name"
                            value={form.lastName ?? ""}
                            onChange={(e) => setForm((s) => ({ ...s, lastName: e.target.value }))}
                            fullWidth
                            sx={inputSx}
                        />
                        <TextField
                            variant="outlined"
                            placeholder="Second Last Name"
                            value={form.secondLastName ?? ""}
                            onChange={(e) => setForm((s) => ({ ...s, secondLastName: e.target.value }))}
                            fullWidth
                            sx={inputSx}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={mUpdate.isPending}
                            sx={{
                                mt: 0.5,
                                height: 48,
                                borderRadius: "14px",
                                fontWeight: 800,
                                textTransform: "none",
                                backgroundColor: YELLOW,
                                color: "#111214",
                                border: `1px solid ${YELLOW}`,
                                boxShadow: `0 6px 20px ${alpha(YELLOW, 0.18)}`,
                                "&:hover": {
                                    backgroundColor: YELLOW,
                                    filter: "brightness(0.98)",
                                    boxShadow: `0 10px 26px ${alpha(YELLOW, 0.24)}`,
                                },
                                "&:active": { transform: "translateY(1px)" },
                            }}
                        >
                            {mUpdate.isPending ? "Saving…" : "Save changes"}
                        </Button>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}