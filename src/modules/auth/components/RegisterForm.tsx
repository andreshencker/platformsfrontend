// src/modules/auth/components/RegisterForm.tsx
import React, { useState } from "react";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { Link } from "react-router-dom";

type Form = {
    firstName: string;
    middleName: string;      // opcional
    lastName: string;
    secondLastName: string;  // opcional
    email: string;
    password: string;
    showPass: boolean;
};

export default function RegisterForm() {
    const { register, loading } = useAuth();
    const [f, setF] = useState<Form>({
        firstName: "",
        middleName: "",
        lastName: "",
        secondLastName: "",
        email: "",
        password: "",
        showPass: false,
    });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setF((s) => ({ ...s, [name]: value }));
    };

    const toggleShow = () => setF((s) => ({ ...s, showPass: !s.showPass }));

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones rápidas en cliente
        const email = f.email.trim();
        const pass = f.password;
        const isEmail = /\S+@\S+\.\S+/.test(email);
        if (!isEmail) return;         // puedes mostrar un mensaje si quieres
        if (pass.length < 6) return;  // idem

        try {
            await register({
                firstName: f.firstName.trim(),
                middleName: f.middleName.trim() || undefined,
                lastName: f.lastName.trim(),
                secondLastName: f.secondLastName.trim() || undefined,
                email,
                password: pass,
            });
            // No mostramos toast aquí para no duplicar; useAuth ya lo hace
            // La redirección por rol también la maneja useAuth.
        } catch {
            // useAuth ya gestiona los toasts de error
        }
    };

    const disabled =
        loading ||
        !f.firstName.trim() ||
        !f.lastName.trim() ||
        !/\S+@\S+\.\S+/.test(f.email.trim()) ||
        f.password.length < 6;

    return (
        <form className="auth-card" onSubmit={onSubmit} autoComplete="on">
            <div className="badge badge-yellow" style={{ marginBottom: 14 }}>
                Secure • Fast
            </div>
            <h2 className="h2" style={{ margin: 0 }}>Create account</h2>

            <div className="spacer" />

            {/* Nombres */}
            <div className="form-row">
                <label style={{ fontWeight: 700, marginBottom: 8, display: "block" }}>
                    Name
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <input
                        className="input"
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        value={f.firstName}
                        onChange={onChange}
                        required
                    />
                    <input
                        className="input"
                        type="text"
                        name="middleName"
                        placeholder="Middle name (optional)"
                        value={f.middleName}
                        onChange={onChange}
                    />
                </div>
            </div>

            {/* Apellidos */}
            <div className="form-row">
                <label style={{ fontWeight: 700, marginBottom: 8, display: "block" }}>
                    Last name
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <input
                        className="input"
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        value={f.lastName}
                        onChange={onChange}
                        required
                    />
                    <input
                        className="input"
                        type="text"
                        name="secondLastName"
                        placeholder="Second last name (optional)"
                        value={f.secondLastName}
                        onChange={onChange}
                    />
                </div>
            </div>

            {/* Email */}
            <div className="form-row">
                <label style={{ fontWeight: 700 }}>Email</label>
                <input
                    className="input"
                    type="email"
                    name="email"
                    placeholder="you@email.com"
                    value={f.email}
                    onChange={onChange}
                    required
                />
            </div>

            {/* Password + toggle */}
            <div className="form-row">
                <label style={{ fontWeight: 700 }}>Password</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
                    <input
                        className="input"
                        type={f.showPass ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        value={f.password}
                        onChange={onChange}
                        required
                    />
                    <button
                        type="button"
                        className="btn-ghost"
                        onClick={toggleShow}
                        aria-label={f.showPass ? "Hide password" : "Show password"}
                        style={{ height: 48 }}
                    >
                        {f.showPass ? "Hide" : "Show"}
                    </button>
                </div>
            </div>

            <div className="spacer" />

            <button
                type="submit"
                className="btn-solid"
                disabled={disabled}
                style={{ width: "100%" }}
            >
                {loading ? "Creating…" : "Create account"}
            </button>

            <div className="spacer" />

            <div className="helper-row">
                <span>Already have an account?</span>
                <Link className="link" to="/login">Sign in</Link>
            </div>
        </form>
    );
}