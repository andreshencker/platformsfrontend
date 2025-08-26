import React, { createContext, useContext, useMemo, useState } from "react";
import type { Platform } from "@/modules/platforms/types/platforms";

type Ctx = {
    selected?: Platform | null;
    setSelected: (p: Platform | null) => void;
    isEditing: boolean;
    startEdit: (p: Platform) => void;
    stopEdit: () => void;
};

const PlatformsCtx = createContext<Ctx | undefined>(undefined);

export function PlatformsProvider({ children }: { children: React.ReactNode }) {
    const [selected, setSelected] = useState<Platform | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const value = useMemo<Ctx>(
        () => ({
            selected,
            setSelected,
            isEditing,
            startEdit: (p) => {
                setSelected(p);
                setIsEditing(true);
            },
            stopEdit: () => {
                setIsEditing(false);
                setSelected(null);
            },
        }),
        [selected, isEditing]
    );

    return <PlatformsCtx.Provider value={value}>{children}</PlatformsCtx.Provider>;
}

export function usePlatformsContext() {
    const ctx = useContext(PlatformsCtx);
    if (!ctx) throw new Error("usePlatformsContext must be used within PlatformsProvider");
    return ctx;
}