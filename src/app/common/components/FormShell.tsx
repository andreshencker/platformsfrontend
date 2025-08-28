import { ReactNode } from "react";
import AsyncButton from "./AsyncButton";

type Props = {
    title?: string;
    description?: string | ReactNode;
    onSubmit: () => void;
    onCancel?: () => void;
    submitText?: string;
    cancelText?: string;
    submitting?: boolean;
    children: ReactNode;
    footerExtra?: ReactNode;
    className?: string;
};

export default function FormShell({
                                      title,
                                      description,
                                      onSubmit,
                                      onCancel,
                                      submitText = "Save",
                                      cancelText = "Cancel",
                                      submitting,
                                      children,
                                      footerExtra,
                                      className = "",
                                  }: Props) {
    return (
        <div className={`rounded-2xl border border-border bg-surface-1 p-5 ${className}`}>
            {title ? (
                <div className="mb-3">
                    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                    {description ? (
                        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                    ) : null}
                </div>
            ) : null}

            <div className="space-y-4">{children}</div>

            <div className="mt-5 flex items-center justify-end gap-2">
                {footerExtra}
                {onCancel ? (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-xl border border-border bg-surface-2 px-4 py-2 hover:bg-surface-3"
                    >
                        {cancelText}
                    </button>
                ) : null}
                <AsyncButton
                    type="button"
                    onClick={onSubmit}
                    loading={submitting}
                    variant="primary"
                >
                    {submitText}
                </AsyncButton>
            </div>
        </div>
    );
}