import React, { useEffect } from "react";
import { Platform } from "@/modules/platforms/types/platforms";

type Props = {
    editing?: Platform | null;
    onDone: () => void;
    onCancel?: () => void;
    onSubmitPlatform: (data: Omit<Platform, "_id" | "createdAt" | "updatedAt" | "__v">, id?: string) => Promise<void>;
};

const categories = ["exchange", "broker", "data", "other"] as const;

export default function PlatformForm({ editing, onDone, onCancel, onSubmitPlatform }: Props) {
    const [name, setName] = React.useState("");
    const [code, setCode] = React.useState("");
    const [website, setWebsite] = React.useState("");
    const [category, setCategory] = React.useState<(typeof categories)[number]>("exchange");
    const [isSupported, setIsSupported] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        if (editing) {
            setName(editing.name ?? "");
            setCode(editing.code ?? "");
            setWebsite(editing.website ?? "");
            setCategory((editing.category as any) ?? "exchange");
            setIsSupported(Boolean(editing.isSupported));
        } else {
            setName("");
            setCode("");
            setWebsite("");
            setCategory("exchange");
            setIsSupported(false);
        }
    }, [editing]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmitPlatform(
                { name, code, website, category, isSupported },
                editing?._id
            );
            onDone();
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Name</label>
                    <input
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-gray-100"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Binance"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Code</label>
                    <input
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-gray-100 uppercase"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="BINANCE"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Website</label>
                    <input
                        type="url"
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-gray-100"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://www.binance.com"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Category</label>
                    <select
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-gray-100"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                    >
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-gray-200">
                <input
                    type="checkbox"
                    className="rounded-md"
                    checked={isSupported}
                    onChange={(e) => setIsSupported(e.target.checked)}
                />
                Platform has support
            </label>

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-yellow-400 text-black px-4 py-2 text-sm font-semibold disabled:opacity-60"
                >
                    {loading ? "Saving..." : editing ? "Update" : "Create"}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-gray-200"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}