import React, { useEffect, useMemo, useState } from "react";

export interface DateRangeValue {
    start?: number; // epoch ms
    end?: number;   // epoch ms
}

interface Props {
    value?: DateRangeValue;
    onChange?: (next: DateRangeValue) => void;
    compact?: boolean;
}

function toLocalInputValue(ms?: number) {
    if (!ms) return "";
    const d = new Date(ms);
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

function fromLocalInputValue(v: string) {
    if (!v) return undefined;
    const ms = new Date(v).getTime();
    return isNaN(ms) ? undefined : ms;
}

export default function DateRangePicker({ value, onChange, compact = false }: Props) {
    const [startStr, setStartStr] = useState<string>(toLocalInputValue(value?.start));
    const [endStr, setEndStr] = useState<string>(toLocalInputValue(value?.end));

    useEffect(() => setStartStr(toLocalInputValue(value?.start)), [value?.start]);
    useEffect(() => setEndStr(toLocalInputValue(value?.end)), [value?.end]);

    const apply = (s?: string, e?: string) => {
        onChange?.({ start: fromLocalInputValue(s ?? startStr), end: fromLocalInputValue(e ?? endStr) });
    };

    const quicks = useMemo(
        () => [
            { label: "24h", ms: 24 * 60 * 60 * 1000 },
            { label: "7d", ms: 7 * 24 * 60 * 60 * 1000 },
            { label: "30d", ms: 30 * 24 * 60 * 60 * 1000 },
        ],
        []
    );

    const pickQuick = (ms: number) => {
        const end = Date.now();
        const start = end - ms;
        setStartStr(toLocalInputValue(start));
        setEndStr(toLocalInputValue(end));
        onChange?.({ start, end });
    };

    const clear = () => {
        setStartStr("");
        setEndStr("");
        onChange?.({});
    };

    return (
        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
            <input
                type="datetime-local"
                value={startStr}
                onChange={(e) => setStartStr(e.target.value)}
                onBlur={() => apply()}
                className="btn btn-outline"
                style={{ padding: "10px 12px", minWidth: compact ? 180 : 220 }}
            />
            <span className="lead">to</span>
            <input
                type="datetime-local"
                value={endStr}
                onChange={(e) => setEndStr(e.target.value)}
                onBlur={() => apply()}
                className="btn btn-outline"
                style={{ padding: "10px 12px", minWidth: compact ? 180 : 220 }}
            />

            {quicks.map((q) => (
                <button key={q.label} className="btn btn-outline" onClick={() => pickQuick(q.ms)}>
                    {q.label}
                </button>
            ))}

            <button className="btn btn-primary" onClick={() => apply()}>
                Apply
            </button>
            <button className="btn btn-outline" onClick={clear}>
                Clear
            </button>
        </div>
    );
}