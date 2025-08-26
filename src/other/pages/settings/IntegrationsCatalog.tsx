import * as React from "react";
import PlatformSelect, { PlatformOption } from "@/other/components/integrations/PlatformSelect";
// ... otros imports

export default function IntegrationsCatalog() {
    const [platforms, setPlatforms] = React.useState<PlatformOption[]>([]);
    const [selectedId, setSelectedId] = React.useState<string | null>(null);

    // Carga de plataformas (ejemplo; usa tu API real)
    React.useEffect(() => {
        let ok = true;
        (async () => {
            try {
                const res = await fetch(import.meta.env.VITE_API_URL + "/platforms");
                const data = await res.json();
                if (!ok) return;
                // mapea a PlatformOption
                const mapped: PlatformOption[] = (Array.isArray(data) ? data : []).map((p: any) => ({
                    id: p._id || p.id,
                    name: p.name,
                    category: p.category,
                    image: p.image,
                    isActive: p.isActive,
                }));
                setPlatforms(mapped);
            } catch {
                setPlatforms([]);
            }
        })();
        return () => {
            ok = false;
        };
    }, []);

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
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <div style={{ fontSize: 14, color: "var(--muted, #8b8b99)", letterSpacing: 0.2 }}>
                        Platforms
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 600 }}>Choose a platform</div>
                </div>
            </div>

            <div style={{ marginTop: 12 }}>
                <PlatformSelect
                    label="Platforms"
                    options={platforms}
                    value={selectedId}
                    onChange={(id) => setSelectedId(id)}
                    placeholder="Select a platform"
                    onlyActive
                />
            </div>

            {/* aquí debajo renderiza el panel de Binance si la selección corresponde */}
            {selectedId && platforms.find((p) => p.id === selectedId)?.name === "Binance" && (
                <div style={{ marginTop: 20 }}>
                    {/* Tu componente de cuentas Binance */}
                    {/* <BinanceAccountsPanel platformId={selectedId} /> */}
                </div>
            )}
        </section>
    );
}