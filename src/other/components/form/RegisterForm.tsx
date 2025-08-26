import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "@/other/hooks/useAuth";
import type { RegisterDTO } from "@/other/types/register";

// ────────────────────────────────────────────────────────────────────────────────
// Schema de validación
// ────────────────────────────────────────────────────────────────────────────────
const schema = z.object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    secondLastName: z.string().optional(),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

// ────────────────────────────────────────────────────────────────────────────────
// UI helper para mensajes de error desde API
// ────────────────────────────────────────────────────────────────────────────────
function extractApiMessage(err: any): string {
    const res = err?.response;
    if (!res) return "Network error. Please try again.";
    if (res.status === 409) return "Email already registered";
    const msg = res.data?.message;
    if (Array.isArray(msg)) return String(msg[0]);
    if (typeof msg === "string") return msg;
    return "Something went wrong. Please try again.";
}

// ────────────────────────────────────────────────────────────────────────────────
// Componente
// ────────────────────────────────────────────────────────────────────────────────
export default function RegisterForm() {
    const navigate = useNavigate();
    const { registerUser, loading } = useAuth();
    const [showPwd, setShowPwd] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: "",
            middleName: "",
            lastName: "",
            secondLastName: "",
            email: "",
            password: "",
        },
        mode: "onTouched",
    });

    const onSubmit = async (values: FormValues) => {
        const dto: RegisterDTO = values;
        try {
            await registerUser(dto); // guarda token + carga /auth/me
            toast.success("Account created! Redirecting…");
            navigate("/dashboard");
        } catch (err) {
            toast.error(extractApiMessage(err));
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Row: First + Middle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="label">First name</label>
                    <input
                        className="input"
                        autoComplete="given-name"
                        {...register("firstName")}
                        aria-invalid={!!errors.firstName || undefined}
                    />
                    {errors.firstName && <p className="err">{errors.firstName.message}</p>}
                </div>

                <div>
                    <label className="label">Middle name (optional)</label>
                    <input
                        className="input"
                        autoComplete="additional-name"
                        {...register("middleName")}
                    />
                </div>
            </div>

            {/* Row: Last + Second last */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="label">Last name</label>
                    <input
                        className="input"
                        autoComplete="family-name"
                        {...register("lastName")}
                        aria-invalid={!!errors.lastName || undefined}
                    />
                    {errors.lastName && <p className="err">{errors.lastName.message}</p>}
                </div>

                <div>
                    <label className="label">Second last name (optional)</label>
                    <input
                        className="input"
                        autoComplete="family-name"
                        {...register("secondLastName")}
                    />
                </div>
            </div>

            {/* Email */}
            <div>
                <label className="label">Email</label>
                <input
                    type="email"
                    className="input"
                    placeholder="you@email.com"
                    autoComplete="email"
                    {...register("email")}
                    aria-invalid={!!errors.email || undefined}
                />
                {errors.email && <p className="err">{errors.email.message}</p>}
            </div>

            {/* Password + toggle */}
            <div>
                <label className="label">Password</label>
                <div className="relative">
                    <input
                        type={showPwd ? "text" : "password"}
                        className="input pr-16"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...register("password")}
                        aria-invalid={!!errors.password || undefined}
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-sm rounded-md bg-[var(--panel)] border border-[var(--border)] hover:opacity-80"
                        onClick={() => setShowPwd((s) => !s)}
                        aria-label={showPwd ? "Hide password" : "Show password"}
                    >
                        {showPwd ? "Hide" : "Show"}
                    </button>
                </div>
                {errors.password && <p className="err">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button type="submit" className="btn-solid w-full" disabled={loading}>
                {loading ? "Creating…" : "Create account"}
            </button>


        </form>
    );
}