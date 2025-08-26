import React from "react";

type Props = {
    label: string;
    apiKeyMasked: string;
    isActive: boolean;
    verified: boolean;
    onSetActive?: () => void;
    onRename?: () => void;
    onDisable?: () => void;
    onDelete?: () => void;
};

export default function BinanceAccountCard({
                                               label,
                                               apiKeyMasked,
                                               isActive,
                                               verified,
                                               onSetActive,
                                               onRename,
                                               onDisable,
                                               onDelete,
                                           }: Props) {
    return (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className="font-medium">{label || "Unnamed account"}</div>
                <div className="flex items-center gap-2 text-xs">
          <span className={`px-2 py-1 rounded-lg ${verified ? "bg-[#14331d] text-[#7fe0a4]" : "bg-[#331414] text-[#ffb4b4]"}`}>
            {verified ? "Verified" : "Invalid"}
          </span>
                    {isActive ? (
                        <span className="px-2 py-1 rounded-lg bg-[#1f2e53] text-[#9ec2ff]">Active</span>
                    ) : null}
                </div>
            </div>

            <div className="text-[var(--muted)] text-sm">{apiKeyMasked}</div>

            <div className="mt-2 flex flex-wrap gap-2">
                {isActive ? null : (
                    <button onClick={onSetActive} className="px-3 py-1 rounded-lg border border-[var(--line)]">Set active</button>
                )}
                <button onClick={onRename} className="px-3 py-1 rounded-lg border border-[var(--line)]">Rename</button>
                <button onClick={onDisable} className="px-3 py-1 rounded-lg border border-[var(--line)]">Disable</button>
                <button onClick={onDelete} className="px-3 py-1 rounded-lg border border-[var(--line)] text-[#ffb4b4]">Delete</button>
            </div>
        </div>
    );
}