import React, { useState } from "react";
import { useCreateBinanceAccount } from "../hooks/useBinanceAccounts";
import type { CreateBinanceAccountDto } from "../types/binanceAccounts";

type Props = {
    userPlatformId: string;     // viene del UserPlatform seleccionado
    onSuccess?: () => void;
};

export default function BinanceConnectForm({ userPlatformId, onSuccess }: Props) {
    const create = useCreateBinanceAccount();
    const [form, setForm] = useState<Pick<CreateBinanceAccountDto,
        "description" | "apiKey" | "apiSecret"
    >>({
        description: "",
        apiKey: "",
        apiSecret: "",
    });

    const disabled =
        !form.description.trim() || !form.apiKey.trim() || !form.apiSecret.trim() || create.isPending;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        await create.mutateAsync({
            userPlatformId,
            description: form.description.trim(),
            apiKey: form.apiKey.trim(),
            apiSecret: form.apiSecret.trim(),
        });
        onSuccess?.();
    };

    return (
        <form className="card" onSubmit={submit}>
            <h3 className="h3" style={{ marginTop: 0 }}>Connect Binance</h3>

            <div className="form-row">
                <label>Label *</label>
                <input
                    className="input"
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    placeholder="e.g., Personal"
                    required
                />
            </div>

            <div className="form-row">
                <label>API Key *</label>
                <input
                    className="input"
                    name="apiKey"
                    value={form.apiKey}
                    onChange={onChange}
                    placeholder="Your Binance API Key"
                    required
                />
            </div>

            <div className="form-row">
                <label>API Secret *</label>
                <input
                    className="input"
                    name="apiSecret"
                    type="password"
                    value={form.apiSecret}
                    onChange={onChange}
                    placeholder="Your Binance API Secret"
                    required
                />
            </div>

            {create.isError && (
                <div className="error">Failed to connect Binance. Please check your credentials.</div>
            )}

            <div className="spacer" />
            <button className="btn-solid" type="submit" disabled={disabled} style={{ minWidth: 180 }}>
                {create.isPending ? "Connecting…" : "Connect"}
            </button>
        </form>
    );
}