import React, { useEffect, useState } from "react";

export type FieldConfig<T> = {
    name: keyof T;
    label: string;
    type?: "text" | "email" | "password" | "select" | "textarea" | "checkbox";
    options?: { label: string; value: any }[]; // para selects
    placeholder?: string;
    transformIn?: (v: any) => any;  // map value -> input
    transformOut?: (v: any) => any; // map input -> value
};

type Props<T> = {
    title?: string;
    initial?: Partial<T> | null;     // si viene algo => edit mode
    fields: FieldConfig<T>[];
    submitLabel?: string;
    onSubmit: (values: T) => void | Promise<void>;
    onCancel?: () => void;
};

export default function EntityForm<T extends Record<string, any>>({
                                                                      title,
                                                                      initial,
                                                                      fields,
                                                                      submitLabel = "Save",
                                                                      onSubmit,
                                                                      onCancel,
                                                                  }: Props<T>) {
    const [form, setForm] = useState<Record<string, any>>({});

    // cargar valores iniciales (edición) o limpiar (creación)
    useEffect(() => {
        const base: Record<string, any> = {};
        fields.forEach((f) => {
            const raw = initial?.[f.name as string];
            base[f.name as string] = f.transformIn ? f.transformIn(raw) : raw ?? (f.type === "checkbox" ? false : "");
        });
        setForm(base);
    }, [initial, fields]);

    const setValue = (name: string, value: any) => {
        setForm((s) => ({ ...s, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload: Record<string, any> = {};
        fields.forEach((f) => {
            const v = form[f.name as string];
            payload[f.name as string] = f.transformOut ? f.transformOut(v) : v;
        });
        await onSubmit(payload as T);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
            {title && <h3 className="h4" style={{ margin: 0 }}>{title}</h3>}

            {fields.map((f) => {
                const name = f.name as string;
                const val = form[name];

                return (
                    <div key={name} style={{ display: "grid", gap: 6 }}>
                        <label style={{ fontSize: 12, color: "var(--muted, #8b8b99)" }}>{f.label}</label>

                        {f.type === "textarea" ? (
                            <textarea
                                value={val ?? ""}
                                onChange={(e) => setValue(name, e.target.value)}
                                placeholder={f.placeholder}
                                rows={4}
                                style={inputStyle}
                            />
                        ) : f.type === "select" ? (
                            <select
                                value={val ?? ""}
                                onChange={(e) => setValue(name, e.target.value)}
                                style={inputStyle}
                            >
                                <option value="" disabled>Selecciona…</option>
                                {f.options?.map((op) => (
                                    <option key={String(op.value)} value={op.value}>
                                        {op.label}
                                    </option>
                                ))}
                            </select>
                        ) : f.type === "checkbox" ? (
                            <input
                                type="checkbox"
                                checked={!!val}
                                onChange={(e) => setValue(name, e.target.checked)}
                                style={{ width: 18, height: 18 }}
                            />
                        ) : (
                            <input
                                type={f.type ?? "text"}
                                value={val ?? ""}
                                onChange={(e) => setValue(name, e.target.value)}
                                placeholder={f.placeholder}
                                style={inputStyle}
                            />
                        )}
                    </div>
                );
            })}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6 }}>
                {onCancel && (
                    <button type="button" onClick={onCancel} className="btn" style={btnGhost}>
                        Cancel
                    </button>
                )}
                <button type="submit" className="btn btn-primary">
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}

const inputStyle: React.CSSProperties = {
    padding: "10px 12px",
    borderRadius: 12,
    background: "var(--inputBg, #0b0b0e)",
    border: "1px solid var(--border, #20202a)",
    color: "var(--fg, #e6e6e6)",
};

const btnGhost: React.CSSProperties = {
    background: "#1A1B1F",
    color: "#E6E6E6",
    border: "1px solid #22242A",
    borderRadius: 10,
    padding: "8px 12px",
};