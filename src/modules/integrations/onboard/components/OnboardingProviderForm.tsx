import React, { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import type { Platform } from "@/modules/platforms/types/platforms";

// UserPlatform API (crear vínculo user↔platform)
import {
    createUserPlatform,
} from "@/modules/userPlatforms/api/userPlatforms";
import type {
    CreateUserPlatformDto,
    UserPlatform,
} from "@/modules/userPlatforms/types/userPlatforms";

// Binance: creación de credenciales sobre el userPlatform
import {
    createBinanceAccount,
} from "@/modules/integrations/binance/api/binanceAccounts";
import type {
    CreateBinanceAccountDto,
} from "@/modules/integrations/binance/types/binanceAccounts";

/** UI del formulario para credenciales de Binance (label, key, secret) */
function BinanceCredentialsForm(props: {
    disabled?: boolean;
    onSubmit: (payload: { description: string; apiKey: string; apiSecret: string }) => void;
}) {
    const { disabled, onSubmit } = props;
    const [description, setDescription] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [apiSecret, setApiSecret] = useState("");

    const canSubmit =
        !!description.trim() && !!apiKey.trim() && !!apiSecret.trim() && !disabled;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit({ description: description.trim(), apiKey: apiKey.trim(), apiSecret: apiSecret.trim() });
    };

    return (
        <form className="card" onSubmit={submit}>
            <div className="card-header">
                <div className="card-title">Connect Binance</div>
            </div>

            <div className="card-content">
                <div className="form-row">
                    <label>Label *</label>
                    <input
                        className="input"
                        placeholder="e.g., Personal"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>API Key *</label>
                    <input
                        className="input"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        required
                        autoComplete="off"
                    />
                </div>

                <div className="form-row">
                    <label>API Secret *</label>
                    <input
                        className="input"
                        type="password"
                        value={apiSecret}
                        onChange={(e) => setApiSecret(e.target.value)}
                        required
                        autoComplete="off"
                    />
                </div>
            </div>

            <div className="card-footer">
                <button className="btn-solid" type="submit" disabled={!canSubmit}>
                    Connect
                </button>
            </div>
        </form>
    );
}

/**
 * Según la plataforma elegida:
 *  - Crea (si no existe) un registro en user-platforms para el usuario y la plataforma (status: pending)
 *  - Lanza el formulario de credenciales del proveedor y crea las credenciales asociadas al userPlatform
 *  - Llama onDone() cuando todo termina OK
 */
const OnboardingProviderForm: React.FC<{
    platform: Platform;
    onDone: () => void;
}> = ({ platform, onDone }) => {
    // ¿Qué proveedor es?
    const isBinance = useMemo(() => platform.code === "binance", [platform]);

    /** 1) Crear UserPlatform (vínculo usuario↔plataforma) */
    const createUP = useMutation({
        mutationFn: async (dto: CreateUserPlatformDto) => {
            const up = await createUserPlatform(dto);
            return up;
        },
    });

    /** 2) Crear credenciales de Binance asociadas al userPlatform */
    const createBinance = useMutation({
        mutationFn: async (payload: {
            userPlatformId: string;
            description: string;
            apiKey: string;
            apiSecret: string;
        }) => {
            const dto: CreateBinanceAccountDto = {
                userPlatformId: payload.userPlatformId,
                description: payload.description,
                apiKey: payload.apiKey,
                apiSecret: payload.apiSecret,
                isActive: true,
            };
            const out = await createBinanceAccount(dto);
            return out;
        },
    });

    const loading = createUP.isPending || createBinance.isPending;

    const ensureUserPlatform = async (): Promise<UserPlatform> => {
        // Creamos siempre un userPlatform "pending" (si tu backend ya previene duplicados, basta con intentar crear)
        try {
            const up = await createUP.mutateAsync({
                platformId: platform._id,
                // status opcional; si no lo pasas, el backend lo pondrá en "pending"
                status: "pending",
                isActive: true,
            });
            return up;
        } catch (err: any) {
            // Si el backend devuelve 409 por duplicado, puedes decidir:
            //  - volver a consultar "getMine" para recuperar el existente
            //  - o propagar error
            // Para pruebas simples, re-lanzamos el error:
            throw err;
        }
    };

    const submitBinance = async (p: {
        description: string;
        apiKey: string;
        apiSecret: string;
    }) => {
        try {
            // 1) Asegurar userPlatform
            const up = await ensureUserPlatform();

            // 2) Crear credenciales asociadas
            await createBinance.mutateAsync({
                userPlatformId: up._id,
                description: p.description,
                apiKey: p.apiKey,
                apiSecret: p.apiSecret,
            });

            toast.success("Binance connected!");
            onDone();
        } catch (err: any) {
            const msg =
                err?.response?.data?.message || err?.message || "Failed to connect";
            toast.error(msg);
        }
    };

    if (!platform.supportsOnboarding) {
        return <p>Onboarding not implemented for {platform.name} yet.</p>;
    }

    return (
        <div>
            {isBinance ? (
                <BinanceCredentialsForm disabled={loading} onSubmit={submitBinance} />
            ) : (
                <p>Onboarding not implemented for {platform.name} yet.</p>
            )}
        </div>
    );
};

export default OnboardingProviderForm;