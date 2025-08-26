import { useEffect, useMemo, useState } from "react";
import DataTable, { type Column } from "@/other/components/shared/DataTable.tsx";
import { useSymbols } from "@/other/hooks/useSymbols";
import { useTrades } from "@/other/hooks/useTrades";

// tipos usados en la app
type Market = "USDM" | "COINM" | "OPTIONS";
type Trade = {
    id: number;
    orderId: number;
    side: "BUY" | "SELL";
    price: string;
    qty: string;
    realizedPnl?: string;
    time: number;
    commission?: string;
};

function toMs(v?: Date | number | string) {
    if (v == null || v === "") return undefined;
    const n = typeof v === "number" ? v : +new Date(v);
    return Number.isFinite(n) ? n : undefined;
}

export default function Trades() {
    // ---------- filtros en edición (UI) ----------
    const [marketEdit, setMarketEdit] = useState<Market>("USDM");
    const [symbolEdit, setSymbolEdit] = useState<string>("");
    const [startEdit, setStartEdit]   = useState<number | undefined>(undefined);
    const [endEdit, setEndEdit]       = useState<number | undefined>(undefined);
    const [limitEdit, setLimitEdit]   = useState<number>(200);
    const [fromId, setFromId]         = useState<number | undefined>(undefined);

    // ---------- filtros aplicados (efectivo para la query) ----------
    const [applied, setApplied] = useState<{
        market: Market;
        symbol: string;
        startTime?: number;
        endTime?: number;
        limit?: number;
        fromId?: number;
    }>({ market: "USDM", symbol: "", limit: 200 });

    // símbolos del mercado seleccionado
    const { data: symbols = [], isFetching: loadingSymbols } = useSymbols(marketEdit);

    // query de trades: sólo se habilita si hay símbolo aplicado
    const {
        data = [],
        isLoading,
        isFetching,
        refetch,
    } = useTrades(
        {
            market: applied.market,
            symbol: applied.symbol,
            limit: applied.limit,
            startTime: applied.startTime,
            endTime: applied.endTime,
            fromId: applied.fromId,
        },
        Boolean(applied.symbol) // enabled
    );

    // logs de depuración (verás algo sí o sí en consola al aplicar)
    useEffect(() => {
        // eslint-disable-next-line no-console
        console.debug("[TRADES] applied ->", applied);
    }, [applied]);

    // cuando cambias de mercado, resetea símbolo y evita consultas automáticas
    const onChangeMarket = (m: Market) => {
        setMarketEdit(m);
        setSymbolEdit("");
        setFromId(undefined);
    };

    const onApply = () => {
        if (!symbolEdit) {
            // eslint-disable-next-line no-alert
            alert("Selecciona un símbolo");
            return;
        }
        const next = {
            market: marketEdit,
            symbol: symbolEdit,
            startTime: toMs(startEdit),
            endTime: toMs(endEdit),
            limit: Math.min(Math.max(limitEdit || 1, 1), 1000),
            fromId,
        };
        setApplied(next);
        refetch(); // dispara ya (por si enabled ya estaba en true)
    };

    const onClearFilters = () => {
        setStartEdit(undefined);
        setEndEdit(undefined);
        setLimitEdit(200);
        setFromId(undefined);
        // NO tocamos applied para no borrar resultados actuales
    };

    // columnas para la tabla
    const columns: Column<Trade>[] = useMemo(
        () => [
            {
                key: "time",
                header: "Time",
                sortable: true,
                render: (r) => new Date(r.time).toLocaleString(),
            },
            {
                key: "side",
                header: "Side",
                sortable: true,
                render: (r) => (
                    <span style={{ color: r.side === "BUY" ? "#2aa7ff" : "#ff4d9a" }}>
            {r.side}
          </span>
                ),
            },
            { key: "price", header: "Price", sortable: true, align: "right" },
            { key: "qty", header: "Qty", align: "right" },
            {
                key: "realizedPnl",
                header: "Realized PnL",
                align: "right",
                render: (r) => {
                    const v = Number(r.realizedPnl ?? 0);
                    return (
                        <span style={{ color: v >= 0 ? "#77e08c" : "#ff7a7a" }}>
              {r.realizedPnl ?? "0"}
            </span>
                    );
                },
            },
            { key: "commission", header: "Fee", align: "right" },
        ],
        []
    );

    // resumen
    const pnl = useMemo(
        () => data.reduce((s: number, t: any) => s + Number(t.realizedPnl ?? 0), 0),
        [data]
    );
    const fees = useMemo(
        () => data.reduce((s: number, t: any) => s + Number(t.commission ?? 0), 0),
        [data]
    );

    return (
        <section className="section">
            <div className="row" style={{ marginBottom: 12, alignItems: "center", gap: 12 }}>
                {/* Botones de mercado */}
                <div className="row" style={{ gap: 8 }}>
                    {(["USDM", "COINM", "OPTIONS"] as Market[]).map((m) => (
                        <button
                            key={m}
                            className={m === marketEdit ? "btn btn-primary" : "btn btn-outline"}
                            onClick={() => onChangeMarket(m)}
                        >
                            {m}
                        </button>
                    ))}
                </div>

                {/* Select símbolo */}
                <select
                    value={symbolEdit}
                    onChange={(e) => setSymbolEdit(e.target.value)}
                    className="btn btn-outline"
                    disabled={loadingSymbols}
                    style={{ minWidth: 220 }}
                >
                    <option value="">{loadingSymbols ? "Cargando..." : "Select symbol..."}</option>
                    {symbols.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>

                {/* Fechas simples (puedes reemplazar por tu DateRangePicker) */}
                <input
                    type="datetime-local"
                    onChange={(e) => setStartEdit(new Date(e.target.value).getTime())}
                    className="btn btn-outline"
                />
                <span>to</span>
                <input
                    type="datetime-local"
                    onChange={(e) => setEndEdit(new Date(e.target.value).getTime())}
                    className="btn btn-outline"
                />

                {/* Acciones */}
                <button className="btn btn-primary" onClick={onApply}>
                    Apply
                </button>
                <button className="btn btn-outline" onClick={onClearFilters}>
                    Clear
                </button>
            </div>

            {/* resumen */}
            <div className="card" style={{ marginBottom: 12 }}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                    <div className="lead">Registros: {data.length}</div>
                    <div className="row" style={{ gap: 16 }}>
                        <div className="lead">
                            PNL:{" "}
                            <span style={{ color: pnl >= 0 ? "#77e08c" : "#ff7a7a" }}>
                {pnl.toFixed(4)}
              </span>
                        </div>
                        <div className="lead">Fees: {fees.toFixed(4)}</div>
                    </div>
                </div>
            </div>

            {/* tabla */}
            <DataTable<Trade>
                columns={columns}
                data={data}
                loading={isLoading || isFetching}
                pageSize={20}
            />
        </section>
    );
}