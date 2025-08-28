import { ReactNode } from "react";

type Row<T> = {
    id: string;
    title: ReactNode;
    subtitle?: ReactNode;
    extra?: ReactNode;
    raw?: T;
};

type Props<T> = {
    rows: Row<T>[];
    selectedId?: string | null;
    onSelect?: (row: Row<T>) => void;
    height?: number; // px del contenedor con scroll
    className?: string;
};

export default function DataList<T>({
                                        rows,
                                        selectedId,
                                        onSelect,
                                        height = 420,
                                        className = "",
                                    }: Props<T>) {
    return (
        <div
            className={`rounded-2xl border border-border bg-surface-1 ${className}`}
            style={{ maxHeight: height }}
        >
            <ul className="divide-y divide-border overflow-auto rounded-2xl">
                {rows.map((r) => {
                    const sel = r.id === selectedId;
                    return (
                        <li key={r.id}>
                            <button
                                onClick={() => onSelect?.(r)}
                                className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-surface-2 ${
                                    sel ? "bg-primary/10" : ""
                                }`}
                            >
                                <div className="min-w-0">
                                    <div className="truncate text-sm font-medium text-foreground">
                                        {r.title}
                                    </div>
                                    {r.subtitle ? (
                                        <div className="truncate text-xs text-muted-foreground">
                                            {r.subtitle}
                                        </div>
                                    ) : null}
                                </div>
                                {r.extra ? <div className="shrink-0">{r.extra}</div> : null}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}