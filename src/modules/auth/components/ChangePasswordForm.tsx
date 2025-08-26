import { useState } from "react";
import { notify } from "@/lib/notify";
import { changePassword } from "@/modules/auth/api/auth";

export default function ChangePasswordForm() {
    const [current, setCurrent] = useState("");
    const [next, setNext] = useState("");
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!current || !next) return notify.error("Both fields are required");
        if (next.length < 8) return notify.error("New password must be at least 8 characters");
        try {
            setLoading(true);
            await changePassword({ current, next });
            notify.success("Password updated");
            setCurrent("");
            setNext("");
        } catch (err: any) {
            notify.error(err?.message ?? "Could not update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4 w-full max-w-lg">
            <div className="space-y-2">
                <label className="block text-sm text-muted">Current password</label>
                <div className="flex items-center gap-2">
                    <input
                        type={show1 ? "text" : "password"}
                        value={current}
                        onChange={(e) => setCurrent(e.target.value)}
                        className="w-full rounded-xl bg-[#121317] border border-[#23242A] px-4 py-3 text-base outline-none focus:border-[#F0B90B]"
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShow1((v) => !v)}
                        className="shrink-0 rounded-xl border border-[#23242A] px-3 py-2 text-sm hover:bg-[#1A1B20]"
                    >
                        {show1 ? "Hide" : "Show"}
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm text-muted">New password</label>
                <div className="flex items-center gap-2">
                    <input
                        type={show2 ? "text" : "password"}
                        value={next}
                        onChange={(e) => setNext(e.target.value)}
                        className="w-full rounded-xl bg-[#121317] border border-[#23242A] px-4 py-3 text-base outline-none focus:border-[#F0B90B]"
                        placeholder="Create a strong password"
                    />
                    <button
                        type="button"
                        onClick={() => setShow2((v) => !v)}
                        className="shrink-0 rounded-xl border border-[#23242A] px-3 py-2 text-sm hover:bg-[#1A1B20]"
                    >
                        {show2 ? "Hide" : "Show"}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#F0B90B] text-black font-medium px-4 py-3 disabled:opacity-70"
            >
                {loading ? "Updating..." : "Update password"}
            </button>
        </form>
    );
}