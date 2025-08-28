import { useEffect, useMemo, useState } from 'react';
import { ThemeContext } from './ThemeContext';
import { DEFAULT_THEME, THEME_STORAGE_KEY, type ThemeName } from './config';
import './theme.css';

type Props = { children: React.ReactNode };

export function ThemeProvider({ children }: Props) {
    const [theme, setThemeState] = useState<ThemeName>(DEFAULT_THEME);

    // init desde localStorage o media query
    useEffect(() => {
        const saved = (localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null);
        if (saved === 'dark' || saved === 'light') {
            setThemeState(saved);
            return;
        }
        // fallback: respeta preferencia del SO
        const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
        setThemeState(prefersDark ? 'dark' : 'light');
    }, []);

    // aplica al :root
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    const value = useMemo(
        () => ({
            theme,
            setTheme: (t: ThemeName) => setThemeState(t),
            toggle: () => setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark')),
        }),
        [theme],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}