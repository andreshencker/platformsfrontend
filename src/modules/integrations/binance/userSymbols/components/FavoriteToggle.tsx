import * as React from "react";
import { IconButton, Tooltip } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import { useUpsertUserSymbol, useDeleteUserSymbolBy } from "../hooks/useUserSymbols";
import type { FuturesMarket } from "../types/userSymbols";
import toast from "react-hot-toast";

/** Botón estrella para (un)marcar favorito de un símbolo en un market */
export default function FavoriteToggle({
                                           symbol,
                                           market,
                                           isActive,
                                           onDone,
                                       }: {
    symbol: string;
    market: FuturesMarket;
    isActive: boolean;
    onDone?: () => void;
}) {
    const add = useUpsertUserSymbol({ market });
    const del = useDeleteUserSymbolBy({ market });

    const toggle = async () => {
        try {
            if (isActive) {
                await del.mutateAsync({ symbol, market });
                toast.success("Removed from favorites");
            } else {
                await add.mutateAsync({ symbol, market });
                toast.success("Added to favorites");
            }
            onDone?.();
        } catch (e: any) {
            toast.error(e?.response?.data?.message ?? e?.message ?? "Operation failed");
        }
    };

    const loading = add.isPending || del.isPending;

    return (
        <Tooltip title={isActive ? "Remove from favorites" : "Add to favorites"}>
      <span>
        <IconButton size="small" onClick={toggle} disabled={loading} sx={{ color: isActive ? "warning.main" : "text.secondary" }}>
          {isActive ? <StarRoundedIcon /> : <StarBorderRoundedIcon />}
        </IconButton>
      </span>
        </Tooltip>
    );
}