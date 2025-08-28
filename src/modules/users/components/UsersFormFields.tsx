// src/modules/users/components/UserRegisterForm.tsx
import { useEffect, useMemo, useState } from "react";
import type { User, UserRole, CreateUserDto, UpdateUserDto } from "../types/types";

type Mode = "create" | "edit";

type Props = {
    mode: Mode;
    initial?: Partial<User>;
    submitting?: boolean;
    /** Admin crea: usa CreateUserDto con password; Edit usa UpdateUserDto sin password */
    onSubmit: (payload: CreateUserDto | UpdateUserDto) => void;
    onCancel?: () => void;
    /** Si en tu app quieres bloquear crear “client” desde admin, deja esto en false */
    allowClientRole?: boolean;
};

const ALL_ROLES: UserRole[] = ["admin", "client"];

export default function UserRegisterForm({
                                             mode,
                                             initial,
                                             submitting,
                                             onSubmit,
                                             onCancel,
                                             allowClientRole = false,
                                         }: Props) {
    // ------- State -------
    const [firstName, setFirstName] = useState(initial?.firstName ?? "");
    const [middleName, setMiddleName] = useState(initial?.middleName ?? "");
    const [lastName, setLastName] = useState(initial?.lastName ?? "");
    const [secondLastName, setSecondLastName] = useState(initial?.secondLastName ?? "");
    const [email, setEmail] = useState(initial?.email ?? "");
    const [role, setRole] = useState<UserRole>(initial?.role ?? "admin");
    const [isActive, setIsActive] = useState<boolean>(initial?.isActive ?? true);
    const [password, setPassword] = useState(""); // solo create
    const [showPwd, setShowPwd] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(initial?.avatarUrl ?? "");

    // ------ Sync cuando cambia "initial" (p.e. al seleccionar tarjeta para editar) ------
    useEffect(() => {
        if (!initial) return;
        setFirstName(initial.firstName ?? "");
        setMiddleName(initial.middleName ?? "");
        setLastName(initial.lastName ?? "");
        setSecondLastName(initial.secondLastName ?? "");
        setEmail(initial.email ?? "");
        setRole((initial.role as UserRole) ?? "admin");
        setIsActive(initial.isActive ?? true);
        setAvatarUrl(initial.avatarUrl ?? "");
    }, [initial]);

    // ------ Roles válidos según política (por defecto excluye "client") ------
    const roleOptions = useMemo<UserRole[]>(
        () => (allowClientRole ? ALL_ROLES : ALL_ROLES.filter((r) => r !== "client")),
        [allowClientRole]
    );

    // ------ Submit ------
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (mode === "create") {
            const payload: CreateUserDto = {
                firstName: firstName.trim(),
                middleName: middleName.trim() || undefined,
                lastName: lastName.trim(),
                secondLastName: secondLastName.trim() || undefined,
                email: email.trim(),
                password, // requerido por create
                role,
                isActive,
                avatarUrl: avatarUrl.trim() || undefined,
            };
            onSubmit(payload);
            return;
        }

        const payload: UpdateUserDto = {
            firstName: firstName.trim(),
            middleName: middleName.trim() || undefined,
            lastName: lastName.trim(),
            secondLastName: secondLastName.trim() || undefined,
            email: email.trim(), // si prefieres impedir cambiar email en edit, deshabilita el input
            role,
            isActive,
            avatarUrl: avatarUrl.trim() || undefined,
        };
        onSubmit(payload);
    }

    // ------ UI (estilo "Create account") ------
    return (
        <form
            onSubmit={handleSubmit}
            style={{
                // “card” con aureola suave tipo registro
                position: "relative",
                padding: 24,
                borderRadius: 20,
                border: "1px solid var(--border, #20202a)",
                background:
                    "radial-gradient(1200px 400px at 20% -10%, rgba(240,185,11,0.07), transparent 55%) , var(--panel, #0f0f16)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
                display: "grid",
                gap: 18,
            }}
        >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
            style={{
                fontSize: 12,
                letterSpacing: 1,
                padding: "4px 8px",
                borderRadius: 999,
                background: "rgba(240,185,11,0.12)",
                color: "#F0B90B",
                border: "1px solid rgba(240,185,11,0.3)",
                fontWeight: 700,
            }}
        >
          SECURE • FAST
        </span>
            </div>
            <h2 style={{ margin: 0, fontSize: 28, lineHeight: 1.15 }}>Create account</h2>

            {/* Nombre */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field
                    label="First name"
                    value={firstName}
                    onChange={setFirstName}
                    placeholder="First name"
                    required
                />
                <Field
                    label="Middle name (optional)"
                    value={middleName}
                    onChange={setMiddleName}
                    placeholder="Middle name"
                />
            </div>

            {/* Apellidos */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field
                    label="Last name"
                    value={lastName}
                    onChange={setLastName}
                    placeholder="Last name"
                    required
                />
                <Field
                    label="Second last name (optional)"
                    value={secondLastName}
                    onChange={setSecondLastName}
                    placeholder="Second last name"
                />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="you@email.com"
                    required
                    disabled={mode === "edit"} // si no quieres bloquearlo, elimina esta línea
                />

                {/* Password (solo create, con toggle show/hide) */}
                {mode === "create" && (
                    <div style={{ display: "grid", gap: 6 }}>
                        <label style={labelStyle}>Password</label>
                        <div style={{ position: "relative" }}>
                            <input
                                className="input"
                                type={showPwd ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                required
                                minLength={6}
                                style={inputStyle}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPwd((s) => !s)}
                                style={{
                                    position: "absolute",
                                    right: 8,
                                    top: 8,
                                    padding: "6px 10px",
                                    borderRadius: 10,
                                    border: "1px solid var(--border, #22242a)",
                                    background: "var(--inputBg, #0b0b0e)",
                                    color: "var(--muted, #9aa0a6)",
                                    cursor: "pointer",
                                }}
                            >
                                {showPwd ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Role + Active */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: 12 }}>
                <div style={{ display: "grid", gap: 6 }}>
                    <label style={labelStyle}>Role</label>
                    <select
                        className="input"
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        style={inputStyle}
                    >
                        {roleOptions.map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 26 }}>
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        id="user-active"
                    />
                    <label htmlFor="user-active" style={{ color: "var(--muted, #9aa0a6)" }}>
                        Active
                    </label>
                </div>
            </div>

            {/* Avatar URL + Preview */}
            <div style={{ display: "grid", gap: 6 }}>
                <label style={labelStyle}>Avatar URL (optional)</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 72px", gap: 12, alignItems: "center" }}>
                    <input
                        className="input"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://…/avatar.png"
                        style={inputStyle}
                    />
                    <div
                        style={{
                            width: 72,
                            height: 72,
                            borderRadius: 14,
                            border: "1px solid var(--border, #22242a)",
                            background: "var(--inputBg, #0b0b0e)",
                            display: "grid",
                            placeItems: "center",
                            overflow: "hidden",
                        }}
                        title={avatarUrl ? "Preview" : "No image"}
                    >
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt="preview"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => {
                                    // fallback si la URL falla
                                    (e.currentTarget as HTMLImageElement).style.display = "none";
                                }}
                            />
                        ) : (
                            <span style={{ fontSize: 11, color: "var(--muted, #8b8b99)" }}>No image</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Acciones */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 6 }}>
                {onCancel && (
                    <button
                        type="button"
                        className="btn"
                        onClick={onCancel}
                        disabled={submitting}
                        style={{
                            background: "#1A1B1F",
                            border: "1px solid #22242A",
                            borderRadius: 12,
                            padding: "10px 16px",
                        }}
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                    style={{
                        background: "#F0B90B",
                        color: "#111214",
                        borderRadius: 12,
                        padding: "10px 18px",
                        fontWeight: 700,
                    }}
                >
                    {mode === "create" ? "Create account" : "Update"}
                </button>
            </div>
        </form>
    );
}

/* ---------- Pequeños helpers de UI ---------- */

function Field({
                   label,
                   value,
                   onChange,
                   placeholder,
                   required,
                   disabled,
                   type = "text",
               }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    type?: "text" | "email";
}) {
    return (
        <div style={{ display: "grid", gap: 6 }}>
            <label style={labelStyle}>{label}</label>
            <input
                className="input"
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                style={inputStyle}
            />
        </div>
    );
}

const labelStyle: React.CSSProperties = {
    fontSize: 13,
    color: "var(--muted, #8b8b99)",
};

const inputStyle: React.CSSProperties = {
    padding: "12px 14px",
    borderRadius: 12,
    background: "var(--inputBg, #0b0b0e)",
    border: "1px solid var(--border, #20202a)",
    color: "#E6E6E6",
};