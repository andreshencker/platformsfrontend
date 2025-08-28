import { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
    variant?: "primary" | "secondary" | "danger" | "ghost";
    full?: boolean;
};

const VARIANTS: Record<NonNullable<Props["variant"]>, string> = {
    primary:
        "bg-primary text-black hover:bg-primary/90 disabled:bg-primary/60 disabled:text-black",
    secondary:
        "bg-surface-3 text-foreground hover:bg-surface-4 disabled:bg-surface-3/60",
    danger:
        "bg-danger text-white hover:bg-danger/90 disabled:bg-danger/60 disabled:text-white",
    ghost:
        "bg-transparent text-foreground hover:bg-surface-3 disabled:text-foreground/60",
};

export default function AsyncButton({
                                        loading,
                                        iconLeft,
                                        iconRight,
                                        children,
                                        variant = "primary",
                                        full,
                                        className = "",
                                        ...rest
                                    }: Props) {
    return (
        <button
            disabled={loading || rest.disabled}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-medium border border-transparent ${VATIANT(variant)} ${full ? "w-full" : ""} ${className}`}
            {...rest}
        >
            {iconLeft}
            {loading ? "Please wait…" : children}
            {iconRight}
        </button>
    );
}

function VATIANT(v: NonNullable<Props["variant"]>) {
    return VARIANTS[v];
}