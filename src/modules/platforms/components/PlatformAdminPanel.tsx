import React from "react";
import { useDeletePlatform, usePlatformsList } from "@/modules/platforms/hooks/usePlatforms";
import PlatformCard from "@/modules/platforms/components/PlatformCard";
import PlatformForm from "@/modules/platforms/components/PlatformForm";
import { PlatformsProvider, usePlatformsContext } from "@/modules/platforms/context/PlatformsContext";

function InnerPanel() {
    const { data, isLoading } = usePlatformsList();
    const { mutateAsync: remove, isPending: removing } = useDeletePlatform();
    const { selected, startEdit, stopEdit } = usePlatformsContext();

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            {/* Lista */}
            <div className="flex flex-col gap-3">
                <div className="text-lg font-semibold">Platforms</div>
                {isLoading ? (
                    <div style={{ color: "var(--muted)" }}>Loading...</div>
                ) : (data ?? []).length === 0 ? (
                    <div
                        className="rounded-xl p-4 border"
                        style={{ borderColor: "var(--line)", background: "var(--panel)" }}
                    >
                        No platforms yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {data!.map((p) => (
                            <PlatformCard
                                key={p._id}
                                item={p}
                                onEdit={startEdit}
                                onDelete={async (id) => {
                                    if (removing) return;
                                    if (!confirm("Delete platform?")) return;
                                    await remove(id);
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Form */}
            <div>
                <PlatformForm editing={selected ?? undefined} onDone={stopEdit} onCancel={stopEdit} />
            </div>
        </div>
    );
}

export default function PlatformAdminPanel() {
    return (
        <PlatformsProvider>
            <InnerPanel />
        </PlatformsProvider>
    );
}