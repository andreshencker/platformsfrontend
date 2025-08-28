import { useTheme } from './ThemeContext';

export function ThemeSwitcher() {
    const { theme, toggle } = useTheme();

    return (
        <button
            onClick={toggle}
            className="btn-primary"
            style={{
                border: '1px solid var(--color-border)',
                padding: '8px 12px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
            }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </button>
    );
}