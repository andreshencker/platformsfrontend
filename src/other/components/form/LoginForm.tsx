// src/components/form/LoginForm.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import type { LoginDTO } from "@/other/types/login";
import { useAuth } from "@/other/hooks/useAuth";

// ────────────────────────────────────────────────────────────
// Validación con Zod (coincide con lo que pide el backend)
const schema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Enter a valid email"),
    password: z
        .string({ required_error: "Password is required" })
        .min(8, "Password must be at least 8 characters"),
});
type FormValues = z.infer<typeof schema>;
// ────────────────────────────────────────────────────────────

export default function LoginForm() {
    const navigate = useNavigate();
    const { login, loading } = useAuth();
    const [showPwd, setShowPwd] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: "onTouched",
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (values: LoginDTO) => {
        try {
            await login(values);
            toast.success("Welcome back!");
            // Redirige al dashboard
            navigate("/dashboard", { replace: true });
        } catch (err: any) {
            // Muestra mensaje amigable
            const msg =
                err?.response?.data?.message ??
                err?.message ??
                "Login failed. Please check your credentials.";
            toast.error(msg);
        }
    };

    return (
        <div className="auth-card">
            <div className="row">
                <span className="badge badge-yellow">SIGN IN</span>
            </div>

            <h2 className="h2 mt-3">Welcome back</h2>
            <p className="muted">Enter your credentials to continue.</p>

            <form className="mt-6 form-row" onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Email */}
                <div>
                    <label className="text-sm text-[var(--muted)]" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="input mt-1"
                        placeholder="you@email.com"
                        autoComplete="email"
                        {...register("email")}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && (
                        <p id="email-error" className="field-error">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password + toggle */}
                <div>
                    <label className="text-sm text-[var(--muted)]" htmlFor="password">
                        Password
                    </label>
                    <div className="password-wrap mt-1">
                        <input
                            id="password"
                            type={showPwd ? "text" : "password"}
                            className="input"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            {...register("password")}
                            aria-invalid={!!errors.password}
                            aria-describedby={errors.password ? "password-error" : undefined}
                        />
                        <button
                            type="button"
                            className="show-btn"
                            onClick={() => setShowPwd((s) => !s)}
                            aria-label={showPwd ? "Hide password" : "Show password"}
                        >
                            {showPwd ? "Hide" : "Show"}
                        </button>
                    </div>
                    {errors.password && (
                        <p id="password-error" className="field-error">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="btn-solid mt-2 w-full"
                    disabled={loading || isSubmitting || !isValid}
                >
                    {loading || isSubmitting ? "Signing in..." : "Sign in"}
                </button>

                {/* CTA */}
                <div className="center lead mt-2">
                    Don’t have an account?{" "}
                    <Link className="link" to="/register">
                        Create one
                    </Link>
                </div>
            </form>

            {/* Estilos mínimos para el toggle si no los tienes ya */}
            <style>
                {`
        .password-wrap { position: relative; }
        .password-wrap .show-btn {
          position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
          font-size: 12px; padding: 4px 8px; border-radius: 8px;
          background: var(--card); color: var(--muted); border: 1px solid var(--border);
        }
        .field-error { color: #ff6b6b; font-size: 12px; margin-top: 6px; }
      `}
            </style>
        </div>
    );
}