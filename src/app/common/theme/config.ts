export type ThemeName = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'ui:theme';

export const THEMES: Record<ThemeName, string> = {
    dark: 'dark',
    light: 'light',
};

export const DEFAULT_THEME: ThemeName = 'dark';