import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    toggleTheme: () => {},
    setTheme: () => {},
    isDark: false,
});

const applyThemeToDOM = (theme: Theme) => {
    const root = document.documentElement;
    const body = document.body;

    if (theme === "dark") {
        root.classList.add("dark");
        body.classList.add("dark");
        root.style.colorScheme = "dark";
    } else {
        root.classList.remove("dark");
        body.classList.remove("dark");
        root.style.colorScheme = "light";
    }

    try {
        localStorage.setItem("findback_theme", theme);
    } catch {
        // ignore
    }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        try {
            const saved = localStorage.getItem("findback_theme");
            if (saved === "dark" || saved === "light") {
                return saved;
            }
        } catch {
            // ignore
        }
        return "light"; // Default to light theme
    });

    useEffect(() => {
        applyThemeToDOM(theme);
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        applyThemeToDOM(newTheme);
    };

    const toggleTheme = () => {
        setThemeState((prev) => {
            const next = prev === "dark" ? "light" : "dark";
            applyThemeToDOM(next);
            return next;
        });
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme,
                setTheme,
                isDark: theme === "dark",
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
