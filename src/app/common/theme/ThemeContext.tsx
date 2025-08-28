import { createContext, useContext } from 'react';
import type { ThemeName } from './config';

export type ThemeContextValue = {
    theme: ThemeName;
    setTheme: (t: ThemeName) => void;
    toggle: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return ctx;
}