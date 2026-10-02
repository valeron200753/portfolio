import { NavLink } from "react-router-dom";

function Header() {
    return (
        <header>
            <nav>
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