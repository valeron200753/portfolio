import {
    createContext,
    useState,
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
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem("theme");

        return savedTheme === "dark" ? "dark" : "light";
    });

    function toggleTheme() {
        setTheme((currentTheme) => {
            const newTheme =
                currentTheme === "light"
                    ? "dark"
                    : "light";

            localStorage.setItem("theme", newTheme);

            return newTheme;
        });
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