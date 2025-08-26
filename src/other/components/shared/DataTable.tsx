import React, { useMemo, useState } from "react";

export type Column<T> = {
    key: keyof T | string;
    header: string;
    align?: "left" | "right" | "center";
    width?: string | number;
    render?: (row: T) => React.ReactNode;
    sortable?: boolean;
};

type SortState = { key: string; dir: "asc" | "desc" } | null;

export interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    emptyMessage?: string;
    pageSize?: number;
    striped?: boolean;
}

export default function DataTable<T extends Record<string, any>>({
                                                                     columns,
                                                                     data,
                                                                     loading = false,
                                                                     emptyMessage = "No data to display.",
                                                                     pageSize = 20,
                                                                     striped = true,
                                                                 }: DataTableProps<T>) {
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState<SortState>(null);

    const sorted = useMemo(() => {
        if (!sort) return data;
        const { key, dir } = sort;
        return [...data].sort((a, b) => {
            const va = a[key as keyof T];
            const vb = b[key as keyof T];
            if (va == null && vb == null) return 0;
            if (va == null) return dir === "asc" ? -1 : 1;
            if (vb == null) return dir === "asc" ? 1 : -1;
            if (typeof va === "number" && typeof vb === "number") {
                return dir === "asc" ? va - vb : vb - va;
            }
            return dir === "asc"
                ? String(va).localeCompare(String(vb))
                : String(vb).localeCompare(String(va));
        });
    }, [data, sort]);

    const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
    const paged = useMemo(() => {
        const start = (page - 1) * pageSize;
        return sorted.slice(start, start + pageSize);
    }, [sorted, page, pageSize]);

    const onSort = (c: Column<T>) => {
        if (!c.sortable) return;
        const key = String(c.key);
        setPage(1);
        setSort((prev) => {
            if (!prev || prev.key !== key) return { key, dir: "asc" };
            return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
        });
    };

    return (
        <div className="card" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                <tr style={{ color: "#a7a7b3", textAlign: "left" }}>
                    {columns.map((c) => {
                        const isSorted = sort?.key === String(c.key);
                        const caret = isSorted ? (sort?.dir === "asc" ? "▲" : "▼") : "";
                        return (
                            <th
                                key={String(c.key)}
                                style={{
                                    padding: "10px 8px",
                                    width: c.width,
                                    cursor: c.sortable ? "pointer" : "default",
                                    textAlign: c.align ?? "left",
                                    whiteSpace: "nowrap",
                                }}
                                onClick={() => onSort(c)}
                            >
                                {c.header} {caret && <span style={{ opacity: 0.7 }}>{caret}</span>}
                            </th>
                        );
                    })}
                </tr>
                </thead>
                <tbody>
                {loading && (
                    <tr>
                        <td colSpan={columns.length} className="lead" style={{ padding: 14 }}>
                            Loading…
                        </td>
                    </tr>
                )}

                {!loading && paged.length === 0 && (
                    <tr>
                        <td colSpan={columns.length} className="lead" style={{ padding: 14 }}>
                            {emptyMessage}
                        </td>
                    </tr>
                )}

                {!loading &&
                    paged.map((row, i) => (
                        <tr
                            key={i}
                            style={{
                                borderTop: "1px solid #23233a",
                                background: striped && i % 2 ? "#0d0d15" : "transparent",
                            }}
                        >
                            {columns.map((c) => (
                                <td
                                    key={String(c.key)}
                                    style={{
                                        padding: "10px 8px",
                                        textAlign: c.align ?? "left",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {c.render ? c.render(row) : String(row[c.key as keyof T] ?? "-")}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="row" style={{ justifyContent: "space-between", marginTop: 12 }}>
                <div className="lead">
                    Page {page} / {pageCount}
                </div>
                <div className="row">
                    <button
                        className="btn btn-outline"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                    >
                        Prev
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                        disabled={page >= pageCount}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}