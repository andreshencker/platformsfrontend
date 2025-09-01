import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/modules/auth/hooks/useAuth";

type LoginFormState = {
    email: string;
    password: string;
    showPass: boolean;
};

export default function LoginForm() {
    const { login, loading } = useAuth();
    const [form, setForm] = useState<LoginFormState>({
        email: "",
        password: "",
        showPass: false,
    });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    };

    const toggleShow = () =>
        setForm((s) => ({ ...s, showPass: !s.showPass }));

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(form.email.trim(), form.password);
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Invalid credentials";
            toast.error(msg);
        }
    };

    const disabled =
        loading || !form.email.trim() || !form.password.trim();

    return (
        <form className="auth-card" onSubmit={onSubmit} autoComplete="on">
            <div className="badge badge-yellow" style={{ marginBottom: 14 }}>
                Secure • Fast
            </div>
            <h2 className="h2" style={{ margin: 0 }}>Sign in</h2>
            <p className="lead" style={{ marginTop: 8 }}>
                Access your performance analytics, reports and live data.
            </p>

            <div className="spacer" />

            <div className="form-row">
                <label style={{ fontWeight: 700 }}>Email</label>
                <input
                    className="input"
                    type="email"
                    name="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={onChange}
                    required
                />
            </div>

            <div className="form-row">
                <label style={{ fontWeight: 700 }}>Password</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
                    <input
                        className="input"
                        type={form.showPass ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={onChange}
                        required
                    />
                    <button
                        type="button"
                        className="btn-ghost"
                        onClick={toggleShow}
                        aria-label={form.showPass ? "Hide password" : "Show password"}
                        style={{ height: 48 }}
                    >
                        {form.showPass ? "Hide" : "Show"}
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
                {loading ? "Signing in…" : "Sign in"}
            </button>

            <div className="spacer" />

            <div className="helper-row">
                <span>Don’t have an account?</span>
                <a className="link" href="/register">Create one</a>
            </div>
        </form>
    );
}