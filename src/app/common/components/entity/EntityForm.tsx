// app/common/components/entity/EntityForm.tsx
import React, { useMemo, useState } from "react";

export type FormMode = "create" | "edit";

export type EntityFormProps<T> = {
    mode: FormMode;
    title?: string;
    initialValues: T;
    /** renderiza tus campos */
    fields: (args: {
        values: T;
        setValue: <K extends keyof T>(key: K, value: T[K]) => void;
        errors: Record<string, string>;
    }) => React.ReactNode;
    validate?: (values: T) => Record<string, string>;
    onSubmit: (values: T) => Promise<void> | void;
    onCancel?: () => void;
    submitLabel?: string;
};

export function EntityForm<T>({
                                  mode,
                                  title,
                                  initialValues,
                                  fields,
                                  validate,
                                  onSubmit,
                                  onCancel,
                                  submitLabel,
                              }: EntityFormProps<T>) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    // reset cuando cambia initialValues (selección nueva)
    useMemo(() => {
        setValues(initialValues);
        setErrors({});
    }, [initialValues]);

    const setValue = <K extends keyof T>(key: K, value: T[K]) => {
        setValues((v) => ({ ...v, [key]: value }));
    };

    const onSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate?.(values) ?? {};
        setErrors(errs);
        if (Object.keys(errs).length) return;
        try {
            setSubmitting(true);
            await onSubmit(values);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={onSubmitForm}
            style={{
                background: "var(--panel, #0f0f16)",
                border: "1px solid var(--border, #20202a)",
                borderRadius: 16,
                padding: 16,
                display: "grid",
                gap: 12,
            }}
        >
            {title && <h3 className="h3" style={{ margin: 0 }}>{title}</h3>}

            {fields({ values, setValue, errors })}

            <div className="row" style={{ justifyContent: "flex-end", gap: 8, marginTop: 6 }}>
                {onCancel && (
                    <button type="button" className="btn-ghost" onClick={onCancel}>
                        Cancel
                    </button>
                )}
                <button type="submit" className="btn-solid" disabled={submitting}>
                    {submitting ? "Saving…" : submitLabel ?? (mode === "create" ? "Create" : "Save changes")}
                </button>
            </div>
        </form>
    );
}