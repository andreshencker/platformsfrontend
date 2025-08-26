import * as React from "react";

export type PlatformOption = {
    id: string;
    name: string;
    category?: string;
    image?: string;     // url del logo (opcional)
    isActive?: boolean; // opcional
};

type Props = {
    label?: string;
    options: PlatformOption[] | null | undefined;
    value?: string | null; // platformId seleccionado
    onChange: (platformId: string | null, platform?: PlatformOption) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    /** Si quieres forzar que sólo muestre activas */
    onlyActive?: boolean;
};

export default function PlatformSelect({
                                           label = "Platforms",
                                           options,
                                           value = null,
                                           onChange,
                                           placeholder = "Select a platform",
                                           disabled,
                                           error,
                                           onlyActive = false,
                                       }: Props) {
    // Tolerante a datos no-array y con filtro de activas si se pide
    const safeOptions = React.useMemo<PlatformOption[]>(
        () =>
            (Array.isArray(options) ? options : []).filter(
                (o) => (onlyActive ? !!o.isActive : true)
            ),
        [options, onlyActive]
    );

    const selected = React.useMemo(
        () => safeOptions.find((o) => o.id === value) || null,
        [safeOptions, value]
    );

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nextId = e.target.value || null;
        const obj = safeOptions.find((o) => o.id === nextId);
        onChange(nextId, obj);
    };

    return (
        <div>
            {label && (
                <label
                    className="text-sm"
                    style={{ color: "var(--muted, #8b8b99)", display: "block", marginBottom: 6 }}
                >
                    {label}
                </label>
            )}

            {/* contenedor con el mismo look de tus inputs */}
            <div
                className="row"
                style={{
                    alignItems: "center",
                    gap: 10,
                    border: "1px solid var(--border, #20202a)",
                    borderRadius: 12,
                    padding: "8px 10px",
                    background: "var(--panel, #0f0f16)",
                    outline: "1px solid rgba(255,212,0,0.2)",
                }}
            >
                {/* Mini logo a la izquierda si hay imagen */}
                {selected?.image ? (
                    <img
                        src={selected.image}
                        alt={selected.name}
                        width={20}
                        height={20}
                        style={{ borderRadius: 6, objectFit: "cover" }}
                    />
                ) : (
                    // fallback: puntito amarillo (como tu estilo)
                    <div
                        style={{
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            background: "#ffd400",
                        }}
                    />
                )}

                <select
                    value={value ?? ""}
                    onChange={handleChange}
                    disabled={disabled}
                    className="input"
                    style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        color: "white",
                        outline: "none",
                        padding: "8px 6px",
                        // quita flecha default en algunos navegadores pero mantiene accesibilidad
                        WebkitAppearance: "none" as any,
                        appearance: "none",
                    }}
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>
                    {safeOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                            {opt.name}
                            {opt.category ? ` · ${opt.category}` : ""}
                        </option>
                    ))}
                </select>
            </div>

            {!!error && (
                <div className="text-xs" style={{ color: "#f87171", marginTop: 6 }}>
                    {error}
                </div>
            )}

            {/* Ayudita visual del seleccionado (opcional) */}
            {selected && (
                <div
                    className="muted"
                    style={{
                        marginTop: 6,
                        fontSize: 12,
                        color: "var(--muted, #8b8b99)",
                    }}
                >
                    Selected: <span style={{ color: "#fff" }}>{selected.name}</span>
                    {selected.category ? ` · ${selected.category}` : ""}
                </div>
            )}
        </div>
    );
}