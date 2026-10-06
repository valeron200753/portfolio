import useLocalStorage from "../hooks/useLocalStorage";
import {
    createContext,
   
    type ReactNode
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

interface ThemeProviderProps {
    children: ReactNode;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    toggleTheme: () => { }
});

export function ThemeProvider({
    children
}: ThemeProviderProps) {
    const [theme, setTheme] =
        useLocalStorage<Theme>("theme", "light");

    function toggleTheme() {
        setTheme((currentTheme) =>
            currentTheme === "light"
                ? "dark"
                : "light"
        );
    }
    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeContext;