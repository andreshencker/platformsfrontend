import React from "react";
import type { Platform } from "@/modules/platforms/types/platforms";

type Props = {
    item: Platform;
    onEdit: (p: Platform) => void;
    onDelete: (id: string) => void;
    isActive?: boolean;
};

export default function PlatformCard({ item, onEdit, onDelete }: Props) {
    return (
        <div
            className="rounded-xl p-4 border cursor-pointer"
            style={{ borderColor: "var(--line)", background: "var(--panel)" }}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    {item.imageUrl ? (
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-8 w-8 rounded-md object-cover"
                        />
                    ) : (
                        <div
                            className="h-8 w-8 rounded-md"
                            style={{ background: "var(--yellow)" }}
                        />
                    )}
                    <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-xs" style={{ color: "var(--muted)" }}>
                            {item.category} · {item.isActive ? "Active" : "Inactive"} ·{" "}
                            {item.isSupported ? "Supported" : "Not supported"}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        className="px-3 py-1 rounded-md"
                        style={{ background: "var(--panel-2)", border: "1px solid var(--line)" }}
                        onClick={() => onEdit(item)}
                    >
                        Edit
                    </button>
                    <button
                        className="px-3 py-1 rounded-md"
                        style={{ background: "var(--danger)" }}
                        onClick={() => onDelete(item._id)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}