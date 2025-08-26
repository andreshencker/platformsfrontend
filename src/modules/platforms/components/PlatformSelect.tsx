import React from "react";
import { Platform } from "@/modules/platforms/types/platforms";
import { usePlatforms } from "@/modules/platforms/hooks/usePlatforms";

type Props = {
    value?: Platform | null;
    /** preferido */
    onChange?: (platform: Platform | null) => void;
    /** compat: algunos sitios usan onSelect */
    onSelect?: (platform: Platform | null) => void;
    placeholder?: string;
};

const PlatformSelect: React.FC<Props> = ({
                                             value = null,
                                             onChange,
                                             onSelect,
                                             placeholder = "Select a platform…",
                                         }) => {
    const { data, isLoading, error } = usePlatforms();

    const handle = (p: Platform | null) => {
        if (onChange) onChange(p);
        else if (onSelect) onSelect(p);
    };

    if (isLoading) return <div>Loading platforms…</div>;
    if (error) return <div style={{ color: "#f66" }}>Failed to load platforms.</div>;

    const list = Array.isArray(data) ? data : [];

    return (
        <select
            className="input"
            value={value?._id ?? ""}
            onChange={(e) => {
                const id = e.target.value;
                const selected = list.find((p) => p._id === id) ?? null;
                handle(selected);
            }}
        >
            <option value="">{placeholder}</option>
            {list.map((p) => (
                <option key={p._id} value={p._id}>
                    {p.name}
                </option>
            ))}
        </select>
    );
};

export default PlatformSelect;