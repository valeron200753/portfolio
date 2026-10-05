import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
function Header() {
   
    return (
        <header>
            <nav>
                <ThemeToggle />
                <NavLink
                    to="/"
                    className={({ isActive }) => isActive ? "active" : ""}
                >
                    Home
                </NavLink>
                <NavLink
                    to="/projects"
                    className={({ isActive }) => isActive ? "active" : ""}
                >
                    Projects
                </NavLink>

                <NavLink
                    to="/contact"
                    className={({ isActive }) => isActive ? "active" : ""}
                >
                    Contact
                </NavLink>
            </nav>
        </header>
    );
}

export default Header;