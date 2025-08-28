import React from "react";

export type CardItem = {
    id: string;
    title: string;
    subtitle?: string;
    avatarUrl?: string;
    rightTag?: string;
};

type Props = {
    items: CardItem[];
    selectedId?: string | null;
    onSelect: (id: string) => void;
    emptyText?: string;
};

export default function CardGrid({ items, selectedId, onSelect, emptyText = "No items" }: Props) {
    if (!items.length) {
        return (
            <div style={{ padding: 24, textAlign: "center", color: "var(--muted, #8b8b99)", border: "1px solid #20202a", borderRadius: 16 }}>
                {emptyText}
            </div>
        );
    }

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 12,
            }}
        >
            {items.map((it) => {
                const active = it.id === selectedId;
                return (
                    <button
                        key={it.id}
                        onClick={() => onSelect(it.id)}
                        style={{
                            textAlign: "left",
                            background: active ? "rgba(240,185,11,0.06)" : "var(--panel, #0f0f16)",
                            border: `1px solid ${active ? "#5a4a0a" : "var(--border, #20202a)"}`,
                            borderRadius: 14,
                            padding: 14,
                            color: "var(--fg, #e6e6e6)",
                            cursor: "pointer",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            {it.avatarUrl ? (
                                <img src={it.avatarUrl} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }} />
                            ) : (
                                <div style={{ width: 36, height: 36, borderRadius: 8, background: "#1a1b1f", border: "1px solid #22242a" }} />
                            )}

                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600 }}>{it.title}</div>
                                {it.subtitle && <div style={{ fontSize: 12, color: "var(--muted, #8b8b99)" }}>{it.subtitle}</div>}
                            </div>

                            {it.rightTag && (
                                <span
                                    style={{
                                        fontSize: 12,
                                        border: "1px solid #22242a",
                                        background: "#1a1b1f",
                                        padding: "2px 8px",
                                        borderRadius: 999,
                                    }}
                                >
                  {it.rightTag}
                </span>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}