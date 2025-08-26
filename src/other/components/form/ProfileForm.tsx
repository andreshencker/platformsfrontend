import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getMe, updateMe, type UpdateProfileDTO, type UserProfile } from "@/other/api/users";
import { toast } from "react-hot-toast";

const schema = z.object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional().or(z.literal("")),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email().min(1), // readonly
});

type FormValues = z.infer<typeof schema>;

export default function ProfileForm() {
    const [me, setMe] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const defaultValues = useMemo<FormValues>(
        () => ({
            firstName: me?.firstName ?? "",
            middleName: me?.middleName ?? "",
            lastName: me?.lastName ?? "",
            email: me?.email ?? "",
        }),
        [me]
    );

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await getMe();
                if (!mounted) return;
                setMe(data);
                reset({
                    firstName: data.firstName ?? "",
                    middleName: data.middleName ?? "",
                    lastName: data.lastName ?? "",
                    email: data.email ?? "",
                });
            } catch (err: any) {
                const msg =
                    err?.response?.status === 401
                        ? "Your session expired. Please log in again."
                        : err?.response?.data?.message ?? "Failed to load profile";
                toast.error(msg);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [reset]);

    const onSubmit = async (values: FormValues) => {
        const payload: UpdateProfileDTO = {
            firstName: values.firstName.trim(),
            middleName: values.middleName?.trim() || undefined,
            lastName: values.lastName.trim(),
        };
        await updateMe(payload);
        toast.success("Adminprofile updated");
        setMe((prev) => (prev ? ({ ...prev, ...payload } as UserProfile) : prev));
    };

    if (loading) {
        return (
            <div className="auth-card mt-6">
                <div className="muted">Loading profile…</div>
            </div>
        );
    }

    if (!me) {
        return (
            <div className="auth-card mt-6">
                <div className="text-red-400">Could not load your profile.</div>
            </div>
        );
    }

    return (
        <div className="auth-card mt-6">
            <div className="row">
                <span className="badge badge-yellow">ACCOUNT</span>
            </div>
            <h2 className="h2 mt-3">Personal details</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 form-row">
                <div className="form-row two">
                    <div>
                        <label className="text-sm text-[var(--muted)]">First name</label>
                        <input className="input mt-1" {...register("firstName")} />
                        {errors.firstName && <p className="err">{errors.firstName.message}</p>}
                    </div>
                    <div>
                        <label className="text-sm text-[var(--muted)]">Middle name (optional)</label>
                        <input className="input mt-1" {...register("middleName")} />
                    </div>
                </div>

                <div className="form-row ">
                    <div>
                        <label className="text-sm text-[var(--muted)]">Last name</label>
                        <input className="input mt-1" {...register("lastName")} />
                        {errors.lastName && <p className="err">{errors.lastName.message}</p>}
                    </div>
                    <div />
                </div>

                <div>
                    <label className="text-sm text-[var(--muted)]">Email</label>
                    <input className="input mt-1" readOnly {...register("email")} />
                    <p className="muted text-xs mt-1">The email is not editable from here.</p>
                </div>

                <button type="submit" className="btn-solid mt-3 w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save changes"}
                </button>
            </form>
        </div>
    );
}