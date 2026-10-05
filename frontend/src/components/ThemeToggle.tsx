import { useContext } from "react";
import ThemeContext from "../context/ThemeContext";

function ThemeToggle() {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <button onClick={toggleTheme}>
            {theme === "light"
                ? "Dark mode"
                : "Light mode"}
        </button>
    );
}

export default ThemeToggle;