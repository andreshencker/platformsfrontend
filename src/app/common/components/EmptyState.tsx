import { ReactNode } from "react";

export default function EmptyState({
                                       title = "Nothing here yet",
                                       description,
                                       action,
                                       className = "",
                                   }: {
    title?: string;
    description?: string | ReactNode;
    action?: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface-1 p-10 text-center ${className}`}
        >
            <div className="text-xl font-semibold text-foreground">{title}</div>
            {description ? (
                <div className="max-w-prose text-sm text-muted-foreground">
                    {description}
                </div>
            ) : null}
            {action ? <div className="mt-2">{action}</div> : null}
        </div>
    );
}