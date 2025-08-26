// /src/components/integrations/BinanceAccountsPanel.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
    listByPlatform,
    createAccount,
    updateAccount,
    removeAccount,
    type BinanceAccount,
    type CreateBinanceAccountDTO,
    type UpdateBinanceAccountDTO,
} from "@/other/api/binanceAccounts";
import { toast } from "react-hot-toast";

type Props = {
    platformId?: string; // requerido para cargar/operar
};

const emptyForm = {
    id: "",
    description: "",
    apiKey: "",
    apiSecret: "",
    isActive: true,
};

export default function BinanceAccountsPanel({ platformId }: Props) {
    const [items, setItems] = useState<BinanceAccount[]>([]);
    const [form, setForm] = useState<typeof emptyForm>(emptyForm);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const isEdit = useMemo(() => !!form.id, [form.id]);

    // Carga la lista cuando cambia la plataforma
    useEffect(() => {
        if (!platformId) {
            setItems([]);
            return;
        }
        (async () => {
            try {
                setLoading(true);
                const data = await listByPlatform(platformId);
                setItems(data);
            } catch (err: any) {
                const msg = err?.response?.data?.message ?? "Failed to load accounts";
                toast.error(String(msg));
            } finally {
                setLoading(false);
            }
        })();
    }, [platformId]);

    const handleChange =
        (field: keyof typeof emptyForm) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const value =
                    field === "isActive"
                        ? (e as React.ChangeEvent<HTMLInputElement>).target.checked
                        : e.target.value;
                setForm((f) => ({ ...f, [field]: value }));
            };

    const resetForm = () => setForm(emptyForm);

    const validate = () => {
        if (!platformId) {
            toast.error("Select a platform first");
            return false;
        }
        if (!form.description.trim()) {
            toast.error("Description is required");
            return false;
        }
        if (!isEdit && !form.apiKey.trim()) {
            toast.error("API Key is required");
            return false;
        }
        if (!isEdit && !form.apiSecret.trim()) {
            toast.error("API Secret is required");
            return false;
        }
        return true;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setSaving(true);

            if (!isEdit) {
                // CREATE
                const payload: CreateBinanceAccountDTO = {
                    platformId: platformId!,
                    description: form.description.trim(),
                    apiKey: form.apiKey.trim(),
                    apiSecret: form.apiSecret.trim(),
                    isActive: form.isActive,
                };
                const created = await createAccount(payload);
                toast.success("Account created");
                setItems((prev) => [created, ...prev]);
                resetForm();
            } else {
                // UPDATE
                const payload: UpdateBinanceAccountDTO = {
                    description: form.description.trim(),
                    isActive: form.isActive,
                };
                if (form.apiKey.trim()) payload.apiKey = form.apiKey.trim();
                if (form.apiSecret.trim()) payload.apiSecret = form.apiSecret.trim();

                const updated = await updateAccount(form.id, payload);
                toast.success("Account updated");
                setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
                resetForm();
            }
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? "Save failed";
            toast.error(String(msg));
        } finally {
            setSaving(false);
        }
    };

    const onEdit = (it: BinanceAccount) => {
        setForm({
            id: it.id,
            description: it.description,
            apiKey: "", // opcional en update
            apiSecret: "", // nunca mostrado, se captura si el user quiere actualizar
            isActive: it.isActive,
        });
    };

    const onDelete = async (id: string) => {
        if (!confirm("Delete this account?")) return;
        try {
            await removeAccount(id);
            setItems((prev) => prev.filter((it) => it.id !== id));
            if (form.id === id) resetForm();
            toast.success("Account deleted");
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? "Delete failed";
            toast.error(String(msg));
        }
    };

    if (!platformId) {
        return (
            <div className="auth-card mt-6">
                <div className="muted">Select a platform to manage API accounts.</div>
            </div>
        );
    }

    return (
        <section
            style={{
                marginTop: 20,
                background: "var(--panel, #0f0f16)",
                border: "1px solid var(--border, #20202a)",
                borderRadius: 16,
                padding: 20,
            }}
        >
            <div className="row" style={{ alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <span className="badge badge-yellow">BINANCE</span>
                    <h3 className="h3 mt-2">API accounts</h3>
                    <p className="muted">
                        Add or edit API keys. <strong>Secret</strong> is write-only (never returned).
                    </p>
                </div>
            </div>

            {/* Formulario */}
            <form onSubmit={onSubmit} className="mt-4 form-row">
                <div className="form-row two">
                    <div>
                        <label className="text-sm text-[var(--muted)]">Description</label>
                        <input
                            className="input mt-1"
                            placeholder="e.g. Main account"
                            value={form.description}
                            onChange={handleChange("description")}
                        />
                    </div>
                    <div className="row" style={{ gap: 8, alignItems: "center", marginTop: 24 }}>
                        <input
                            id="isActive"
                            type="checkbox"
                            checked={form.isActive}
                            onChange={handleChange("isActive")}
                        />
                        <label htmlFor="isActive">Enabled</label>
                    </div>
                </div>

                <div className="form-row two">
                    <div>
                        <label className="text-sm text-[var(--muted)]">
                            API Key {isEdit ? <span className="muted">(optional to update)</span> : null}
                        </label>
                        <input
                            className="input mt-1"
                            placeholder="Your Binance API key"
                            value={form.apiKey}
                            onChange={handleChange("apiKey")}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-[var(--muted)]">
                            API Secret {isEdit ? <span className="muted">(optional to update)</span> : null}
                        </label>
                        <input
                            className="input mt-1"
                            placeholder="Your Binance API secret"
                            value={form.apiSecret}
                            onChange={handleChange("apiSecret")}
                        />
                    </div>
                </div>

                <button className="btn-solid mt-3" disabled={saving}>
                    {saving ? "Saving..." : isEdit ? "Update" : "Create"}
                </button>
                {isEdit && (
                    <button
                        type="button"
                        className="btn btn-outline mt-3"
                        style={{ marginLeft: 8 }}
                        onClick={resetForm}
                    >
                        Cancel
                    </button>
                )}
            </form>

            {/* Lista */}
            <div className="mt-8">
                <div className="h4">My Binance accounts</div>
                {loading ? (
                    <div className="muted mt-2">Loading…</div>
                ) : items.length === 0 ? (
                    <div className="muted mt-2">No accounts yet.</div>
                ) : (
                    <div className="mt-3" style={{ display: "grid", gap: 10 }}>
                        {items.map((it) => (
                            <div
                                key={it.id}
                                style={{
                                    border: "1px solid var(--border, #20202a)",
                                    borderRadius: 12,
                                    padding: 12,
                                    background: "rgba(255,255,255,0.02)",
                                }}
                            >
                                <div className="row" style={{ justifyContent: "space-between", gap: 10 }}>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontWeight: 600 }}>{it.description}</div>
                                        <div className="muted text-xs">API Key: {it.apiKey}</div>
                                        <div className="muted text-xs">
                                            Status: {it.isActive ? "Enabled" : "Disabled"} · Updated:{" "}
                                            {new Date(it.updatedAt).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="row" style={{ gap: 8 }}>
                                        <button className="btn btn-outline" onClick={() => onEdit(it)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-outline" onClick={() => onDelete(it.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}}