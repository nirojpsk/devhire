export const THEME_STORAGE_KEY = "devhire-theme";
export const THEMES = {
    LIGHT: "light",
    DARK: "dark",
};

function isBrowser() {
    return typeof window !== "undefined";
}

function isValidTheme(theme) {
    return theme === THEMES.LIGHT || theme === THEMES.DARK;
}

function getSystemTheme() {
    if (!isBrowser()) {
        return THEMES.LIGHT;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? THEMES.DARK
        : THEMES.LIGHT;
}

export function getStoredTheme() {
    if (!isBrowser()) {
        return null;
    }

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isValidTheme(storedTheme) ? storedTheme : null;
}

export function getPreferredTheme() {
    return getStoredTheme() || getSystemTheme();
}

export function persistTheme(theme) {
    if (!isBrowser() || !isValidTheme(theme)) {
        return;
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function applyTheme(theme) {
    if (typeof document === "undefined" || !isValidTheme(theme)) {
        return;
    }

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
}
