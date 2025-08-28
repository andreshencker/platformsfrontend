// app/common/components/entity/EntityList.tsx
import React, { useMemo, useState } from "react";

export type SortOption<T> = {
    value: string;
    label: string;
    compare: (a: T, b: T) => number;
};

export type Badge = { label: string; tone?: "neutral" | "warning" | "success" | "danger" };

export type EntityListProps<T> = {
    items: T[];
    keyField: keyof T & string;
    /** título principal de la tarjeta */
    titleField: keyof T & string;
    /** campos secundarios (en fila bajo el título) */
    subtitleFields?: (keyof T & string)[];
    /** url de imagen (si aplica) */
    imageField?: keyof T & string;

    /** id seleccionado (resalta la tarjeta) */
    selectedId?: string | null;
    onSelect?: (item: T) => void;

    /** búsqueda y ordenamiento local */
    searchable?: boolean;
    sortable?: boolean;
    sortOptions?: SortOption<T>[];
    defaultSort?: string;

    /** paginación (opcional) */
    pagination?: {
        pageSizeOptions?: number[];
        defaultPageSize?: number;
    };

    /** badges en la tarjeta */
    badges?: (item: T) => Badge[];

    /** acciones por tarjeta (p. ej. "view" | "delete") */
    actions?: ("view" | "delete" | "custom")[];
    onAction?: (action: "view" | "delete" | "custom", item: T) => void;

    /** alto máximo de la lista (scroll) */
    maxHeight?: number;
};

export function EntityList<T>({
                                  items,
                                  keyField,
                                  titleField,
                                  subtitleFields = [],
                                  imageField,
                                  selectedId,
                                  onSelect,
                                  searchable = true,
                                  sortable = true,
                                  sortOptions = [],
                                  defaultSort,
                                  pagination,
                                  badges,
                                  actions,
                                  onAction,
                                  maxHeight = 560,
                              }: EntityListProps<T>) {
    const [query, setQuery] = useState("");
    const [sortValue, setSortValue] = useState(defaultSort ?? (sortOptions[0]?.value ?? ""));
    const [pageSize, setPageSize] = useState(pagination?.defaultPageSize ?? 20);
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        let arr = items;
        if (q) {
            arr = items.filter((it) => {
                const title = String((it as any)[titleField] ?? "").toLowerCase();
                const subs = subtitleFields
                    .map((f) => String((it as any)[f] ?? "").toLowerCase())
                    .join(" ");
                return title.includes(q) || subs.includes(q);
            });
        }
        if (sortable && sortOptions.length) {
            const opt = sortOptions.find((s) => s.value === sortValue) ?? sortOptions[0];
            if (opt) arr = [...arr].sort(opt.compare);
        }
        return arr;
    }, [items, query, sortValue, sortable, sortOptions, subtitleFields, titleField]);

    const paginated = useMemo(() => {
        if (!pagination) return filtered;
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, pagination, page, pageSize]);

    const totalPages = pagination ? Math.max(1, Math.ceil(filtered.length / pageSize)) : 1;

    return (
        <div
            style={{
                background: "var(--panel, #0f0f16)",
                border: "1px solid var(--border, #20202a)",
                borderRadius: 16,
                padding: 12,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                height: "100%",
            }}
        >
            {/* Barra superior: búsqueda + orden + page size */}
            <div className="row" style={{ gap: 8, alignItems: "center" }}>
                {searchable && (
                    <input
                        placeholder="Search…"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (pagination) setPage(1);
                        }}
                        className="input"
                        style={{ flex: 1, minWidth: 0 }}
                    />
                )}
                {sortable && sortOptions.length > 0 && (
                    <select
                        className="input"
                        value={sortValue}
                        onChange={(e) => setSortValue(e.target.value)}
                        style={{ width: 160 }}
                    >
                        {sortOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                )}
                {pagination && (
                    <select
                        className="input"
                        value={String(pageSize)}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPage(1);
                        }}
                        style={{ width: 96 }}
                    >
                        {(pagination.pageSizeOptions ?? [10, 20, 50]).map((n) => (
                            <option key={n} value={n}>
                                {n}/page
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Lista (una sola columna), con scroll */}
            <div style={{ overflowY: "auto", maxHeight, display: "grid", gap: 8 }}>
                {paginated.length === 0 && (
                    <div
                        style={{
                            padding: 16,
                            borderRadius: 12,
                            border: "1px solid var(--border, #20202a)",
                            color: "var(--muted, #8b8b99)",
                            textAlign: "center",
                        }}
                    >
                        No results.
                    </div>
                )}

                {paginated.map((it) => {
                    const id = String((it as any)[keyField]);
                    const selected = selectedId === id;

                    return (
                        <button
                            key={id}
                            onClick={() => onSelect?.(it)}
                            className="btn-ghost"
                            style={{
                                textAlign: "left",
                                display: "grid",
                                gridTemplateColumns: imageField ? "56px 1fr auto" : "1fr auto",
                                gap: 12,
                                padding: 12,
                                borderRadius: 12,
                                border: selected ? "1px solid var(--accent, #F0B90B)" : "1px solid var(--border, #20202a)",
                                background: selected ? "rgba(240,185,11,0.06)" : "var(--panel, #0f0f16)",
                                cursor: "pointer",
                                alignItems: "center",
                            }}
                        >
                            {imageField && (
                                <div
                                    style={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 10,
                                        background: "#0b0b0e",
                                        border: "1px solid var(--border, #20202a)",
                                        overflow: "hidden",
                                    }}
                                >
                                    {/* imagen por URL si existe */}
                                    {((it as any)[imageField] as any) ? (
                                        <img
                                            src={String((it as any)[imageField])}
                                            alt=""
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    ) : null}
                                </div>
                            )}

                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontWeight: 700, color: "var(--text, #e6e6e6)" }}>
                                    {String((it as any)[titleField] ?? "")}
                                </div>
                                {subtitleFields.length > 0 && (
                                    <div
                                        style={{
                                            fontSize: 12,
                                            color: "var(--muted, #8b8b99)",
                                            display: "flex",
                                            gap: 8,
                                            flexWrap: "wrap",
                                            marginTop: 4,
                                        }}
                                    >
                                        {subtitleFields.map((f) => (
                                            <span key={f}>{String((it as any)[f] ?? "")}</span>
                                        ))}
                                    </div>
                                )}
                                {/* Badges */}
                                {badges && (
                                    <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                                        {badges(it).map((b, i) => {
                                            const map: Record<string, React.CSSProperties> = {
                                                neutral: { background: "#1A1B1F", color: "#E6E6E6", border: "1px solid #22242A" },
                                                warning: { background: "rgba(240,185,11,0.12)", color: "#F0B90B", border: "1px solid #3b2f05" },
                                                success: { background: "rgba(16,185,129,0.12)", color: "#10B981", border: "1px solid #0a3a2c" },
                                                danger: { background: "rgba(240,61,61,0.12)", color: "#F03D3D", border: "1px solid #3a0a0a" },
                                            };
                                            const style = map[b.tone ?? "neutral"];
                                            return (
                                                <span key={i} className="badge" style={{ ...style, padding: "2px 8px", borderRadius: 8 }}>
                          {b.label}
                        </span>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Acciones */}
                            {actions?.length ? (
                                <div style={{ display: "flex", gap: 6 }}>
                                    {actions.includes("view") && (
                                        <span
                                            role="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onAction?.("view", it);
                                            }}
                                            className="link"
                                        >
                      View
                    </span>
                                    )}
                                    {actions.includes("delete") && (
                                        <span
                                            role="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onAction?.("delete", it);
                                            }}
                                            className="link"
                                        >
                      Delete
                    </span>
                                    )}
                                </div>
                            ) : null}
                        </button>
                    );
                })}
            </div>

            {/* Paginación simple */}
            {pagination && (
                <div className="row" style={{ justifyContent: "space-between", marginTop: 4 }}>
                    <small style={{ color: "var(--muted)" }}>
                        Page {page} / {totalPages} • {filtered.length} items
                    </small>
                    <div className="row" style={{ gap: 8 }}>
                        <button className="btn-ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                            Prev
                        </button>
                        <button
                            className="btn-ghost"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}