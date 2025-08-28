import { useMemo, useState } from "react";
import SearchBar from "./SearchBar";
import CardGrid, { CardItem } from "./CardGrid";
import EntityForm, { FieldConfig } from "./EntityForm";

type LoadResult<T> = { items: T[]; total?: number };

type Props<T> = {
    title?: string;
    // datos
    data: LoadResult<T>;
    isLoading?: boolean;

    // funciones para CRUD
    onCreate: (dto: Partial<T>) => Promise<void> | void;
    onUpdate: (id: string, dto: Partial<T>) => Promise<void> | void;

    // mapeos
    toCard: (t: T) => CardItem;
    toId: (t: T) => string;

    // form config
    formTitle?: string;
    fields: FieldConfig<T>[];

    // lectura por selección (opcional)
    byId?: (id: string) => T | undefined;

    // búsqueda
    search: string;
    setSearch: (s: string) => void;
};

export default function CrudShell<T extends Record<string, any>>({
                                                                     title,
                                                                     data,
                                                                     isLoading,
                                                                     onCreate,
                                                                     onUpdate,
                                                                     toCard,
                                                                     toId,
                                                                     formTitle = "Details",
                                                                     fields,
                                                                     byId,
                                                                     search,
                                                                     setSearch,
                                                                 }: Props<T>) {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const cards = useMemo<CardItem[]>(() => data.items.map(toCard), [data.items, toCard]);
    const selected = selectedId && byId ? byId(selectedId) : null;

    const handleSubmit = async (values: T) => {
        if (selected) {
            await onUpdate(toId(selected), values);
        } else {
            await onCreate(values);
        }
        // tras guardar, limpiar selección (modo create)
        setSelectedId(null);
    };

    return (
        <div className="container section" style={{ display: "grid", gap: 16 }}>
            {title && <h1 className="h3" style={{ margin: 0 }}>{title}</h1>}

            {/* search + actions */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 12,
                alignItems: "center",
                background: "var(--panel, #0f0f16)",
                border: "1px solid var(--border, #20202a)",
                borderRadius: 16,
                padding: 14,
            }}>
                <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email…" />
                <button
                    className="btn"
                    onClick={() => setSelectedId(null)}
                    style={{ borderRadius: 10, border: "1px solid #22242a", background: "#1a1b1f", color: "#e6e6e6" }}
                >
                    New
                </button>
            </div>

            {/* grid + form */}
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
                <div>
                    {isLoading ? (
                        <div style={{ padding: 24, border: "1px solid #20202a", borderRadius: 16 }}>Loading…</div>
                    ) : (
                        <CardGrid items={cards} selectedId={selectedId} onSelect={setSelectedId} />
                    )}
                </div>

                <div style={{ background: "var(--panel, #0f0f16)", border: "1px solid var(--border, #20202a)", borderRadius: 16, padding: 16 }}>
                    <EntityForm<T>
                        title={formTitle + (selected ? " (edit)" : " (create)")}
                        initial={selected ?? null}
                        fields={fields}
                        submitLabel={selected ? "Update" : "Create"}
                        onSubmit={handleSubmit}
                        onCancel={() => setSelectedId(null)}
                    />
                </div>
            </div>
        </div>
    );
}