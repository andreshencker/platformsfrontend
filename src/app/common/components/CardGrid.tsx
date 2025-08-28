import { ReactNode } from "react";

export type CardItem = {
    id: string;
    title: string;
    subtitle?: string;
    imageUrl?: string;
    rightExtra?: ReactNode;
};

type Props = {
    items: CardItem[];
    onClick?: (id: string) => void;
    selectedId?: string | null;
    columns?: number; // por defecto 3
    empty?: ReactNode;
};

export default function CardGrid({
                                     items,
                                     onClick,
                                     selectedId,
                                     columns = 3,
                                     empty,
                                 }: Props) {
    if (!items?.length) return empty ?? null;

    return (
        <div
            className="grid gap-4"
            style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
        >
            {items.map((it) => {
                const sel = selectedId === it.id;
                return (
                    <button
                        key={it.id}
                        onClick={() => onClick?.(it.id)}
                        className={`group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                            sel
                                ? "border-primary bg-primary/10"
                                : "border-border bg-surface-2 hover:bg-surface-3"
                        }`}
                    >
                        {it.imageUrl ? (
                            <img
                                src={it.imageUrl}
                                alt={it.title}
                                className="h-10 w-10 rounded-lg object-cover"
                            />
                        ) : (
                            <div className="h-10 w-10 rounded-lg bg-surface-4" />
                        )}

                        <div className="min-w-0 flex-1">
                            <div className="truncate font-medium text-foreground">
                                {it.title}
                            </div>
                            {it.subtitle ? (
                                <div className="truncate text-xs text-muted-foreground">
                                    {it.subtitle}
                                </div>
                            ) : null}
                        </div>

                        {it.rightExtra}
                    </button>
                );
            })}
        </div>
    );
}