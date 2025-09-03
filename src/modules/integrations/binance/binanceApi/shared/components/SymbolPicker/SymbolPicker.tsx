import * as React from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Tabs,
    Tab,
    Autocomplete,
    TextField,
    IconButton,
    ButtonBase,
    Stack,
    useTheme,
    alpha,
} from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";

import { fetchFuturesSymbols } from "@/modules/integrations/binance/binanceApi/futures/api/futures";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addUserSymbol, listUserSymbols, removeUserSymbol } from "@/modules/integrations/binance/userSymbols/api/userSymbols";
import type { UserSymbol,FuturesMarket } from "@/modules/integrations/binance/userSymbols/types/userSymbols";
import toast from "react-hot-toast";

// UI helpers (mismo look del perfil)
function useFormTokens() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const YELLOW = "#ffd400";

    const inputBg = isDark ? "#141422" : "#ffffff";
    const inputBr = isDark ? "#23233a" : "#e5e7eb";
    const inputText = isDark ? "#ffffff" : "#111214";
    const placeholder = isDark ? "#ffffff66" : alpha("#111214", 0.5);

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
            "& .MuiOutlinedInput-input": { height: 24, padding: "12px 14px" },
        },
        "& .MuiInputBase-input::placeholder": { color: placeholder },
    } as const;

    const cardBg = isDark
        ? `radial-gradient(1200px 500px at 80% -20%, ${alpha(YELLOW, 0.09)} 0, transparent 70%), rgba(17,17,25,.66)`
        : `radial-gradient(1200px 500px at 80% -20%, ${alpha(YELLOW, 0.08)} 0, transparent 75%), #ffffff`;
    const cardBorder = isDark ? "#24243a" : theme.palette.divider;
    const cardShadow = isDark
        ? `0 30px 80px #00000055 inset, 0 10px 40px #00000055`
        : `0 12px 36px rgba(17,17,17,.06)`;

    return { YELLOW, inputSx, cardBg, cardBorder, cardShadow };
}

type SubTab = "all" | "favorites";

export type FuturesSymbolPickerSimpleProps = {
    accountId: string;
    defaultMarket?: FuturesMarket;
    height?: number;
    onChange?: (payload: { market: FuturesMarket; symbol: string | null }) => void;
};

export default function FuturesSymbolPickerSimple({
                                                      accountId,
                                                      defaultMarket = "USDM",
                                                      height = 560,
                                                      onChange,
                                                  }: FuturesSymbolPickerSimpleProps) {
    const theme = useTheme();
    const { YELLOW, inputSx, cardBg, cardBorder, cardShadow } = useFormTokens();
    const qc = useQueryClient();

    // ===== State
    const [market, setMarket] = React.useState<FuturesMarket>(defaultMarket);
    const [subTab, setSubTab] = React.useState<SubTab>("all");
    const [value, setValue] = React.useState<string | null>(null);

    // ===== Queries
    const qSymbols = useQuery({
        queryKey: ["futuresSymbols", market],
        queryFn: () => fetchFuturesSymbols(market),
        staleTime: 1000 * 60 * 5,
    });

    const qFavorites = useQuery({
        queryKey: ["userSymbols", accountId, market],
        queryFn: () => listUserSymbols(accountId, market),
        enabled: !!accountId,
    });

    // Reset value on market change to avoid out-of-range warnings
    React.useEffect(() => {
        setValue(null);
    }, [market]);

    // ===== Favorite helpers
    const isFavorite = React.useMemo(() => {
        if (!value || !qFavorites.data) return false;
        return qFavorites.data.some((f) => f.symbol === value);
    }, [value, qFavorites.data]);

    const favBySymbol = (sym: string): UserSymbol | undefined =>
        qFavorites.data?.find((f) => f.symbol === sym);

    const mAdd = useMutation({
        mutationFn: (symbol: string) => addUserSymbol({ accountId, market, symbol }),
        onMutate: async (symbol) => {
            await qc.cancelQueries({ queryKey: ["userSymbols", accountId, market] });
            const prev = qc.getQueryData<UserSymbol[]>(["userSymbols", accountId, market]) || [];
            const optimistic: UserSymbol = {
                _id: `optimistic-${Date.now()}`,
                accountId,
                market,
                symbol,
            };
            qc.setQueryData(["userSymbols", accountId, market], [...prev, optimistic]);
            return { prev };
        },
        onError: (e, _vars, ctx) => {
            qc.setQueryData(["userSymbols", accountId, market], ctx?.prev || []);
            toast.error(e?.message ?? "Could not add favorite");
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["userSymbols", accountId, market] });
            toast.success("Added to favorites");
        },
    });

    const mRemove = useMutation({
        mutationFn: (id: string) => removeUserSymbol(id),
        onMutate: async (id) => {
            await qc.cancelQueries({ queryKey: ["userSymbols", accountId, market] });
            const prev = qc.getQueryData<UserSymbol[]>(["userSymbols", accountId, market]) || [];
            qc.setQueryData(
                ["userSymbols", accountId, market],
                prev.filter((f) => f._id !== id),
            );
            return { prev };
        },
        onError: (e, _vars, ctx) => {
            qc.setQueryData(["userSymbols", accountId, market], ctx?.prev || []);
            toast.error(e?.message ?? "Could not remove favorite");
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["userSymbols", accountId, market] });
            toast.success("Removed from favorites");
        },
    });

    const toggleFavorite = () => {
        if (!value) {
            toast.error("Select a symbol first");
            return;
        }
        const fav = favBySymbol(value);
        if (fav) mRemove.mutate(fav._id);
        else mAdd.mutate(value);
    };

    // ===== Handlers
    const handleSelect = (_: any, newValue: string | null) => {
        setValue(newValue);
        onChange?.({ market, symbol: newValue });
    };

    // ===== UI
    return (
        <Card
            variant="outlined"
            sx={{
                height,
                maxWidth: 980,
                borderRadius: "20px",
                borderColor: cardBorder,
                background: cardBg,
                boxShadow: cardShadow,
                p: { xs: 2, sm: 3 },
                display: "flex",
                flexDirection: "column",
            }}
        >
            <CardContent sx={{ p: 0, display: "flex", flexDirection: "column", gap: 1.5, flex: 1, minHeight: 0 }}>
                {/* Tabs de mercado */}
                <Tabs
                    value={market}
                    onChange={(_, v) => setMarket(v)}
                    textColor="inherit"
                    indicatorColor="secondary"
                    sx={{
                        "& .MuiTab-root": { textTransform: "none", fontWeight: 700, minHeight: 0, p: 0, mr: 3 },
                        "& .MuiTabs-indicator": { bgcolor: YELLOW, height: 2, borderRadius: 2 },
                    }}
                >
                    <Tab value="USDM" label="USDⓈ-M" />
                    <Tab value="COINM" label="COIN-M" />
                    <Tab value="OPTIONS" label="OPTIONS" />
                </Tabs>

                <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                    Market: <b>{market}</b>
                </Typography>

                {/* Fila: Select + estrella */}
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ flex: 1 }}>
                        <Autocomplete
                            value={value}
                            onChange={handleSelect}
                            options={qSymbols.data ?? []}
                            loading={qSymbols.isLoading}
                            filterSelectedOptions={false}
                            disableClearable={false}
                            autoHighlight
                            // Evita 'out-of-range' si value no está en options
                            isOptionEqualToValue={(o, v) => o === v}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Select a symbol"
                                    sx={inputSx}
                                />
                            )}
                        />
                    </Box>

                    <IconButton
                        onClick={toggleFavorite}
                        disabled={!value || qFavorites.isLoading}
                        sx={{
                            borderRadius: "12px",
                            border: `1px solid ${alpha(YELLOW, 0.35)}`,
                            width: 48, height: 48,
                            bgcolor: "transparent",
                            "&:hover": { bgcolor: alpha(YELLOW, 0.08) },
                        }}
                    >
                        {isFavorite ? <StarIcon htmlColor={YELLOW} /> : <StarBorderIcon htmlColor={YELLOW} />}
                    </IconButton>
                </Stack>

                {/* Sub-tabs All / Favorites */}
                <Tabs
                    value={subTab}
                    onChange={(_, v) => setSubTab(v)}
                    sx={{
                        mt: 0.5,
                        "& .MuiTab-root": { textTransform: "uppercase", fontWeight: 800, minHeight: 0, p: 0, mr: 2 },
                        "& .MuiTabs-indicator": { bgcolor: YELLOW, height: 2, borderRadius: 2 },
                    }}
                >
                    <Tab value="all" label="All" />
                    <Tab value="favorites" label="Favorites" />
                </Tabs>

                {/* Panel scrollable */}
                <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", pt: 1 }}>
                    {subTab === "all" ? (
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            Pick a symbol from the select above. You can type to filter.
                        </Typography>
                    ) : (
                        <FavoritesList
                            favorites={qFavorites.data ?? []}
                            current={value}
                            onPick={(sym) => handleSelect(null, sym)}
                            onToggle={(sym) => {
                                const fav = favBySymbol(sym);
                                if (fav) mRemove.mutate(fav._id);
                                else mAdd.mutate(sym);
                            }}
                            isLoading={qFavorites.isLoading}
                        />
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}

function FavoritesList({
                           favorites,
                           current,
                           onPick,
                           onToggle,
                           isLoading,
                       }: {
    favorites: UserSymbol[];
    current: string | null;
    onPick: (symbol: string) => void;
    onToggle: (symbol: string) => void;
    isLoading: boolean;
}) {
    const theme = useTheme();
    const YELLOW = "#ffd400";
    if (isLoading) {
        return <Typography sx={{ color: "text.secondary" }}>Loading favorites…</Typography>;
    }
    if (!favorites.length) {
        return <Typography sx={{ color: "text.secondary" }}>No favorites yet.</Typography>;
    }
    return (
        <Stack spacing={0.75}>
            {favorites.map((f) => {
                const active = current === f.symbol;
                return (
                    <Stack
                        key={f._id}
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{
                            border: `1px solid ${alpha(theme.palette.divider, 1)}`,
                            borderRadius: "12px",
                            px: 1,
                            py: 0.5,
                            background: active ? alpha(YELLOW, 0.06) : "transparent",
                        }}
                    >
                        <ButtonBase
                            onClick={() => onPick(f.symbol)}
                            sx={{
                                flex: 1,
                                textAlign: "left",
                                borderRadius: "10px",
                                px: 1,
                                py: 1,
                            }}
                        >
                            <Typography fontWeight={700}>{f.symbol}</Typography>
                        </ButtonBase>

                        <IconButton
                            aria-label="toggle favorite"
                            onClick={() => onToggle(f.symbol)}
                            sx={{
                                borderRadius: "10px",
                                border: `1px solid ${alpha(YELLOW, 0.35)}`,
                                width: 40,
                                height: 40,
                            }}
                        >
                            <StarIcon htmlColor={YELLOW} />
                        </IconButton>
                    </Stack>
                );
            })}
        </Stack>
    );
}