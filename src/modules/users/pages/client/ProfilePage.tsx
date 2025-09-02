import * as React from "react";
import { Container, Typography } from "@mui/material";
import ProfileForm from "@/modules/users/components/ProfileForm";

export default function ProfilePage() {
    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
                My Profile
            </Typography>
            <ProfileForm />
        </Container>
    );
}