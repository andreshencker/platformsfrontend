import { useMemo } from "react";

type Props = {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    debounceMs?: number;
};

export default function SearchBar({ value, onChange, placeholder = "Search…", debounceMs = 250 }: Props) {
    // mínima protección de rendimiento
    const handler = useMemo(() => {
        let t: any;
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            const v = e.target.value;
            clearTimeout(t);
            t = setTimeout(() => onChange(v), debounceMs);
        };
    }, [onChange, debounceMs]);

    return (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <input
                defaultValue={value}
                onChange={handler}
                placeholder={placeholder}
                style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 12,
                    background: "var(--inputBg, #0b0b0e)",
                    border: "1px solid var(--border, #20202a)",
                    color: "var(--fg, #e6e6e6)",
                }}
            />
        </div>
    );
}