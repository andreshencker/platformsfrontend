// app/common/components/entity/MasterDetail.tsx
import React, { useMemo, useState } from "react";
import { EntityList, EntityListProps } from "./EntityList";
import { EntityForm, EntityFormProps, FormMode } from "./EntityForm";

type MasterDetailProps<T> = {
    items: T[];
    keyField: keyof T & string;

    /** valores por defecto al pulsar “New” */
    defaults: () => T;

    /** props de lista (sin items/selectedId/onSelect) */
    listProps: Omit<EntityListProps<T>, "items" | "selectedId" | "onSelect">;

    /**
     * Genera los props del formulario a partir del item seleccionado y el modo.
     * Importante: debes pasar `initialValues` y las funciones validate/onSubmit/fields.
     */
    formPropsBuilder: (initialValues: T, mode: FormMode) => Omit<EntityFormProps<T>, "initialValues" | "mode">;
};

export function MasterDetail<T>({
                                    items,
                                    keyField,
                                    defaults,
                                    listProps,
                                    formPropsBuilder,
                                }: MasterDetailProps<T>) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [mode, setMode] = useState<FormMode>("create");

    const selected = useMemo(() => {
        return items.find((it) => String((it as any)[keyField]) === selectedId);
    }, [items, keyField, selectedId]);

    const initialValues = selected ? (selected as T) : defaults();

    const formProps = formPropsBuilder(initialValues, selected ? "edit" : mode);

    return (
        <div
            style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "360px 1fr",
            }}
        >
            <div style={{ minHeight: 480 }}>
                <div className="row" style={{ marginBottom: 8, justifyContent: "space-between" }}>
                    <strong style={{ color: "var(--text, #e6e6e6)" }}>Items</strong>
                    <button
                        className="btn-ghost"
                        onClick={() => {
                            setSelectedId(null);
                            setMode("create");
                        }}
                    >
                        New
                    </button>
                </div>

                <EntityList
                    {...listProps}
                    items={items}
                    selectedId={selectedId}
                    onSelect={(it) => {
                        setSelectedId(String((it as any)[keyField]));
                        setMode("edit");
                    }}
                />
            </div>

            <div>
                <EntityForm
                    mode={selected ? "edit" : mode}
                    initialValues={initialValues}
                    {...formProps}
                    onCancel={() => {
                        setSelectedId(null);
                        setMode("create");
                    }}
                />
            </div>
        </div>
    );
}