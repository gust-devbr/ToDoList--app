import { createContext, useContext, useState } from "react";

export const ThemeContext = createContext();

const lightTheme = {
    background: "#FFFFFF",
    text: "#000000",
    primary: "#4F46E5",
    card: "#F3F4F6",
};

const darkTheme = {
    background: "#121212",
    text: "#FFFFFF",
    primary: "#6366F1",
    card: "#1E1E1E",
};

export function ThemeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(false);

    const theme = darkMode ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider
            value={{
                theme,
                darkMode,
                setDarkMode,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used inside ThemeProvider");
    }

    return context;
}
