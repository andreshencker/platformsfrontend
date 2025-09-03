import React, { useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import type { Platform } from "@/modules/platforms/types/platforms";

// APIs existentes (usa tus rutas actuales)
import {
    createUserPlatform,
    changeUserPlatformStatus,
    setDefaultUserPlatform,
} from "@/modules/userPlatforms/api/userPlatforms";

import {
    createBinanceAccount,
} from "@/modules/integrations/binance/binanceAccount/api/binanceAccounts";

// Si guardas el default en storage
const DEFAULT_UP_STORAGE_KEY = "defaultUserPlatformId";

type Props = {
    platform: Platform;
    onSuccess: () => void;
};

type FormState = {
    apiKey: string;
    apiSecret: string;
    description: string;
    isDefault: boolean;
};

const BinanceCredentialsForm: React.FC<Props> = ({ platform, onSuccess }) => {
    const [form, setForm] = useState<FormState>({
        apiKey: "",
        apiSecret: "",
        description: "",
        isDefault: true,
    });
    const [showSecret, setShowSecret] = useState(false);
    const [loading, setLoading] = useState(false);

    const platformName = useMemo(() => platform?.name ?? "Binance", [platform]);
    const disabled =
        loading || !form.apiKey.trim() || !form.apiSecret.trim();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((s) => ({
            ...s,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        if (disabled) return;

        setLoading(true);
        try {
            // 1) Crear userPlatform en estado "pending"
            const up = await createUserPlatform({
                platformId: platform._id,   // <- usamos el id real de la plataforma
                isDefault: form.isDefault,   // si quieres que quede por defecto
            });

            // (opcional) si se creó como default, garantizamos unicidad (según tu backend)
            if (form.isDefault && up?._id) {
                try {
                    await setDefaultUserPlatform(up._id);
                } catch {
                    // si tu servicio ya hace la unicidad, esto no es necesario
                }
            }

            // 2) Crear la cuenta de binance asociada a ese userPlatform
            //    BACK actual mapea: POST /integrations/binance-accounts
            await createBinanceAccount({
                userPlatformId: up._id,
                apiKey: form.apiKey.trim(),
                apiSecret: form.apiSecret.trim(),
                description: form.description.trim(),
                isDefault: true, // puedes usar la misma bandera
            });

            // 3) Actualizar status del userPlatform a connected
            await changeUserPlatformStatus(up._id, "connected");

            // 4) Guardar en localStorage el userPlatform por defecto (si aplica)
            if (form.isDefault) {
                localStorage.setItem(DEFAULT_UP_STORAGE_KEY, up._id);
            }

            toast.success(`${platformName} connected successfully`);
            onSuccess();
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Could not connect Binance account";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="auth-card" onSubmit={handleConnect} style={{ width: "100%" }}>
            <h2 className="h2" style={{ marginTop: 0, marginBottom: 8 }}>
                Connect {platformName}
            </h2>
            <p className="muted" style={{ marginTop: 0 }}>
                Enter your API key and secret. We’ll verify them and link your account.
            </p>

            <div className="spacer" />

            <div className="form-row">
                <label style={{ fontWeight: 700 }}>API Key</label>
                <input
                    className="input"
                    type="text"
                    name="apiKey"
                    placeholder="Enter your API key"
                    value={form.apiKey}
                    onChange={onChange}
                    required
                />
            </div>

            <div className="form-row">
                <label style={{ fontWeight: 700 }}>API Secret</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
                    <input
                        className="input"
                        type={showSecret ? "text" : "password"}
                        name="apiSecret"
                        placeholder="Enter your API secret"
                        value={form.apiSecret}
                        onChange={onChange}
                        required
                    />
                    <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => setShowSecret((s) => !s)}
                        aria-label={showSecret ? "Hide secret" : "Show secret"}
                        style={{ height: 48 }}
                    >
                        {showSecret ? "Hide" : "Show"}
                    </button>
                </div>
            </div>

            <div className="form-row">
                <label style={{ fontWeight: 700 }}>Label (optional)</label>
                <input
                    className="input"
                    type="text"
                    name="description"
                    placeholder="Personal label (optional)"
                    value={form.description}
                    onChange={onChange}
                />
            </div>

            <div className="form-row" style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <input
                    id="isDefault"
                    type="checkbox"
                    name="isDefault"
                    checked={form.isDefault}
                    onChange={onChange}
                />
                <label htmlFor="isDefault" className="muted">
                    Set as my default platform/account
                </label>
            </div>

            <div className="spacer" />

            <button
                type="submit"
                className="btn-solid"
                disabled={disabled}
                style={{ width: "100%", padding: "14px 18px" }}
            >
                {loading ? "Connecting…" : "Connect"}
            </button>
        </form>
    );
};

export default BinanceCredentialsForm;