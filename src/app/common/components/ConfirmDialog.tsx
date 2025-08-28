import { ReactNode, useEffect } from "react";

type Props = {
    open: boolean;
    title?: string;
    description?: string | ReactNode;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onClose: () => void;
};

export default function ConfirmDialog({
                                          open,
                                          title = "Are you sure?",
                                          description,
                                          confirmText = "Confirm",
                                          cancelText = "Cancel",
                                          onConfirm,
                                          onClose,
                                      }: Props) {
    useEffect(() => {
        function onEsc(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        if (open) window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-border bg-surface-1 p-5 shadow-2xl">
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                {description ? (
                    <div className="mt-2 text-muted-foreground">{description}</div>
                ) : null}
                <div className="mt-5 flex items-center justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-border bg-surface-2 px-4 py-2 text-foreground hover:bg-surface-3"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="rounded-xl bg-danger px-4 py-2 font-medium text-white hover:bg-danger/90"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}