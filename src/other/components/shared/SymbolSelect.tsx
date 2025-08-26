import React from "react";
import Select from "react-select";

type Props = {
    value: string;
    onChange: (v: string) => void;
    options: string[];
    placeholder?: string;
    disabled?: boolean;
};

export default function SymbolSelect({ value, onChange, options, placeholder="Select symbol...", disabled }: Props) {
    const selectOptions = options.map(s => ({ value: s, label: s }));

    return (
        <Select
            value={selectOptions.find(o => o.value === value) || null}
            onChange={(opt) => onChange(opt ? (opt as any).value : "")}
            options={selectOptions}
            isClearable
            isSearchable
            isDisabled={disabled}
            placeholder={placeholder}
            menuPortalTarget={document.body}
            styles={{
                control: (p, s) => ({
                    ...p,
                    backgroundColor: "#111119",
                    borderColor: s.isFocused ? "#3a3a4a" : "#2a2a35",
                    minWidth: 220,
                    borderRadius: 9999,
                    boxShadow: "none",
                    ":hover": { borderColor: "#3a3a4a" },
                }),
                singleValue: (p) => ({ ...p, color: "white" }),
                input: (p) => ({ ...p, color: "white" }),
                placeholder: (p) => ({ ...p, color: "#8b8b98" }),
                menu: (p) => ({ ...p, backgroundColor: "#1b1b26", borderRadius: 8, overflow: "hidden", zIndex: 30 }),
                option: (p, st) => ({
                    ...p,
                    backgroundColor: st.isFocused ? "#2a2a35" : "#1b1b26",
                    color: "white",
                    cursor: "pointer",
                }),
            }}
        />
    );
}