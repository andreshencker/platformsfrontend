import React from "react";
import { useUserPlatforms, useChangeUserPlatformStatus } from "../hooks/useUserPlatforms";
import type { UserPlatform } from "../types/userPlatforms";

type Props = {
    onManage?: (up: UserPlatform) => void; // e.g., abrir modal credenciales
};

export default function UserPlatformsList({ onManage }: Props) {
    const { data, isLoading, isError } = useUserPlatforms();
    const changeStatus = useChangeUserPlatformStatus();

    if (isLoading) return <div className="muted">Loading…</div>;
    if (isError) return <div className="muted">Failed to load user platforms.</div>;

    const list = data ?? [];

    const doDisconnect = (up: UserPlatform) =>
        changeStatus.mutate({ id: up._id, dto: { status: "disconnected" } });

    const doReconnect = (up: UserPlatform) =>
        changeStatus.mutate({ id: up._id, dto: { status: "connected" } });

    return (
        <div className="grid gap-3">
            {list.length === 0 && <div className="muted">No connected platforms yet.</div>}
            {list.map((up) => (
                <div key={up._id} className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-lg" style={{ fontWeight: 700 }}>
                                {up.platform?.name ?? up.platformId}
                            </div>
                            <div className="muted">
                                Status: <b>{up.status}</b> {up.isActive ? "" : "(inactive)"}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="btn-ghost" onClick={() => onManage?.(up)}>
                                Manage
                            </button>
                            {up.status !== "connected" ? (
                                <button className="btn-solid" onClick={() => doReconnect(up)}>
                                    Reconnect
                                </button>
                            ) : (
                                <button className="btn-ghost" onClick={() => doDisconnect(up)}>
                                    Disconnect
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}