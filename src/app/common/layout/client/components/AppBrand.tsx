import * as React from "react";
import { Box, Typography } from "@mui/material";

type Props = {
    name?: string;
};

export default function AppBrand({ name = "Client Console" }: Props) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 18, height: 18, borderRadius: 1, bgcolor: "primary.main" }} />
            <Typography variant="subtitle2" fontWeight={700}>
                {name}
            </Typography>
        </Box>
    );
}