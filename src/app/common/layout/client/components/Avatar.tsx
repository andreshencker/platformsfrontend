import * as React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { useAuth } from "@/modules/auth/hooks/useAuth";

type Props = {
    size?: number;
    showName?: boolean;
    className?: string;
    variant?: "default" | "sidebar";
};

export default function AvatarBlock({
                                        size = 56,
                                        showName = true,
                                        className,
                                        variant = "default",
                                    }: Props) {
    const { user } = useAuth();

    const fullName =
        [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() || "User";

    const initials = React.useMemo(() => {
        const a = (user?.firstName || "").trim()[0]?.toUpperCase() ?? "U";
        const b = (user?.lastName || "").trim()[0]?.toUpperCase() ?? "";
        return `${a}${b}`;
    }, [user?.firstName, user?.lastName]);

    const avatarUrl = (user as any)?.avatarUrl || (user as any)?.imageUrl || "";

    return (
        <Box className={className} sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Avatar
                src={avatarUrl || undefined}
                alt={fullName}
                sx={{
                    width: size,
                    height: size,
                    fontWeight: 700,
                    bgcolor: variant === "sidebar" ? "grey.900" : "background.paper",
                    color: variant === "sidebar" ? "grey.100" : "text.primary",
                    border: 1,
                    borderColor: "divider",
                }}
            >
                {initials}
            </Avatar>

            {showName && (
                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle1" fontWeight={700} noWrap>
                        {fullName}
                    </Typography>
                    {user?.email && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                            sx={{ display: "block" }}
                            title={user.email}
                        >
                            {user.email}
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    );
}