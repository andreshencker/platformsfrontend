import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import PlatformSelect from "@/modules/platforms/components/PlatformSelect";
import type { Platform } from "@/modules/platforms/types/platforms";

// Formulario específico de Binance (el botón Connect está adentro)
import BinanceCredentialsForm from "@/modules/integrations/binance/components/BinanceCredentialsForm";

const Onboarding: React.FC = () => {
    const [selected, setSelected] = useState<Platform | null>(null);
    const navigate = useNavigate();

    // Normalizamos clave de plataforma (por si el select solo trae name)
    const selectedKey = useMemo(() => {
        const raw = (selected?.code ?? selected?.name ?? "").toString();
        return raw.trim().toLowerCase(); // "binance", "kraken", etc.
    }, [selected]);

    const handleSuccess = () => {
        // Al finalizar el flujo con éxito (crear userPlatform + binanceAccount + status)
        navigate("/client/dashboard", { replace: true });
    };

    return (
        <section className="section container">
            <div className="auth-grid">
                {/* Copy lateral */}
                <div>
                    <div className="badge badge-purple" style={{ marginBottom: 12 }}>
                        CLIENT
                    </div>
                    <h1 className="h1">Let’s connect your account</h1>
                    <p className="lead" style={{ maxWidth: 560 }}>
                        Choose a supported platform to link your API keys and start.
                    </p>
                </div>

                {/* Selector + contenido (mismo ancho visual) */}
                <div style={{ marginTop: 32, width: "100%" }}>
                    <PlatformSelect
                        value={selected}
                        onChange={setSelected}
                        // Si tu PlatformSelect acepta props de tamaño, mantenemos el ancho uniforme
                        className="w-full"
                    />

                    {selected && (
                        <div style={{ marginTop: 24, width: "100%" }}>
                            {selectedKey === "binance" ? (
                                <BinanceCredentialsForm
                                    platform={selected}
                                    onSuccess={handleSuccess}
                                />
                            ) : (
                                <p style={{ opacity: 0.7 }}>
                                    Onboarding not implemented for <strong>{selected.name ?? selectedKey}</strong> yet.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};



export default Onboarding;