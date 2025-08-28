import { useEffect, useMemo, useState } from "react";

type Props = {
    placeholder?: string;
    defaultValue?: string;
    onChange: (value: string) => void;
    /** ms para debounce */
    delay?: number;
    className?: string;
};

export default function SearchBar({
                                      placeholder = "Search…",
                                      defaultValue = "",
                                      onChange,
                                      delay = 300,
                                      className = "",
                                  }: Props) {
    const [value, setValue] = useState(defaultValue);

    const debounced = useMemo(() => {
        let t: number | undefined;
        return (v: string) => {
            window.clearTimeout(t);
            t = window.setTimeout(() => onChange(v), delay);
        };
    }, [onChange, delay]);

    useEffect(() => {
        debounced(value);
    }, [value, debounced]);

    return (
        <div className={`w-full ${className}`}>
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl bg-surface-2 border border-border px-4 py-2 text-foreground outline-none focus:border-primary"
            />
        </div>
    );
}