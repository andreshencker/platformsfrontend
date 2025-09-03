import React, { useState } from "react";
import BinanceAccountCard from "../../components/BinanceAccountCard";
import BinanceCredentialsForm from "../../components/BinanceCredentialsForm";
import {
    useBinanceAccounts,
    useCreateBinanceAccount,
    useDeleteBinanceAccount,
    useUpdateBinanceAccount,
    useVerifyBinance,
} from "../../hooks/useBinanceAccounts";
import { useIntegrations } from "@/app/context/IntegrationsContext";

export default function BinanceAccountsPage() {
    const { activePlatformId, setActiveAccount } = useIntegrations();
    const platformId = activePlatformId || "binance";

    const list = useBinanceAccounts(platformId);
    const verify = useVerifyBinance();
    const create = useCreateBinanceAccount(platformId);
    const update = useUpdateBinanceAccount(platformId);
    const remove = useDeleteBinanceAccount(platformId);

    const [error, setError] = useState<string | null>(null);

    const handleCreate = async (values: { label?: string; apiKey: string; apiSecret: string }) => {
        setError(null);
        try {
            const v = await verify.mutateAsync({ apiKey: values.apiKey, apiSecret: values.apiSecret });
            if (!v.ok) return setError(v.message || "Invalid credentials");

            await create.mutateAsync({ platformId, ...values });
        } catch (e: any) {
            setError(e?.response?.data?.message ?? "Failed to create account");
        }
    };

    return (
        <div className="container mx-auto max-w-6xl px-4 py-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Binance accounts</h1>
                {/* Aquí podrías poner un modal. Para simplificar lo dejamos inline */}
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-10">
                {(list.data ?? []).map(acc => (
                    <BinanceAccountCard
                        key={acc._id}
                        label={acc.label}
                        apiKeyMasked={acc.apiKeyMasked}
                        isActive={acc.isActive}
                        verified={acc.verified}
                        onSetActive={() => update.mutate({ id: acc._id, patch: { setActive: true } }).then(() => setActiveAccount(acc._id))}
                        onRename={() => {
                            const name = prompt("New label", acc.label || "");
                            if (name == null) return;
                            update.mutate({ id: acc._id, patch: { label: name } });
                        }}
                        onDisable={() => update.mutate({ id: acc._id, patch: { isActive: false } })}
                        onDelete={() => remove.mutate(acc._id)}
                    />
                ))}
            </div>

            <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6">
                <h2 className="text-xl font-semibold mb-4">Add new connection</h2>
                <BinanceCredentialsForm
                    onSubmit={handleCreate}
                    submitting={verify.isPending || create.isPending}
                    error={error}
                />
            </div>
        </div>
    );
}