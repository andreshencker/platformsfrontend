import * as React from "react";
import {
    Box,
    Chip,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useDeleteUserSymbol, useUserSymbols } from "../hooks/useUserSymbols";
import type { FuturesMarket } from "../types/userSymbols";
import toast from "react-hot-toast";

/** Lista simple de favoritos filtrada por market */
export default function FavoritesList({
                                          market,
                                          onPick,
                                      }: {
    market: FuturesMarket;
    onPick?: (symbol: string) => void;
}) {
    const { data, isLoading } = useUserSymbols({ market });
    const del = useDeleteUserSymbol({ market });

    if (isLoading) return <Typography variant="body2">Loading…</Typography>;
    if (!data?.length) return <Typography variant="body2">No favorites yet.</Typography>;

    return (
        <List dense sx={{ p: 0 }}>
            {data.map((row) => (
                <ListItem
                    key={row._id}
                    divider
                    secondaryAction={
                        <IconButton
                            edge="end"
                            size="small"
                            onClick={async () => {
                                try {
                                    await del.mutateAsync(row._id);
                                    toast.success("Removed");
                                } catch (e: any) {
                                    toast.error(e?.response?.data?.message ?? e?.message ?? "Could not remove");
                                }
                            }}
                        >
                            <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                    }
                    sx={{
                        px: 1,
                        "&:hover": { bgcolor: "action.hover", cursor: "pointer" },
                    }}
                    onClick={() => onPick?.(row.symbol)}
                >
                    <ListItemText
                        primary={
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography fontWeight={700}>{row.symbol}</Typography>
                                <Chip size="small" label={row.market.toUpperCase()} />
                            </Box>
                        }
                        secondary={row.note}
                    />
                </ListItem>
            ))}
        </List>
    );
}