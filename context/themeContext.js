import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ThemeContext = createContext();

const lightTheme = {
    background: "#FFFFFF",
    content: "#f7f7f7",
    text: "#000000",
    primary: "#4F46E5",
    card: "#F3F4F6",
};

const darkTheme = {
    background: "#121212",
    content: "#6a6a6a",
    text: "#FFFFFF",
    primary: "#6366F1",
    card: "#1E1E1E",
};

export function ThemeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(false);
    const [loading, setLoading] = useState(true);

    const theme = darkMode ? darkTheme : lightTheme;

    useEffect(() => {
        async function loadTheme() {
            const storedTheme = await AsyncStorage.getItem("@theme");

            if (storedTheme === 'dark') {
                setDarkMode(true)
            };
            loadTheme(false);
        };
        loadTheme();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem("@theme", darkMode ? 'dark' : 'light');
    }, [darkMode]);

    if (loading) return null;

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
};