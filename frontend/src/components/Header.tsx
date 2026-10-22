
import { NavLink } from "react-router-dom";

import ThemeToggle from "./ThemeToggle";
import "./Header.css";

function Header() {
    const navClass = ({
        isActive
    }: {
        isActive: boolean;
    }) =>
        `site-nav__link${isActive ? " is-active" : ""}`;

    return (
        <header className="site-header">
            <div className="site-header__inner">

                <NavLink
                    to="/"
                    className="site-header__brand"
                    aria-label="TOKYO.DEV — Home"
                >
                    <span
                        className="site-header__brand-icon"
                        aria-hidden="true"
                    >
                        T.
                    </span>

                    <span className="site-header__brand-name">
                        TOKYO<span>.DEV</span>
                    </span>
                </NavLink>

                <nav
                    className="site-nav"
                    aria-label="Main navigation"
                >
                    <NavLink
                        to="/"
                        end
                        className={navClass}
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/projects"
                        className={navClass}
                    >
                        Projects
                    </NavLink>

                    <NavLink
                        to="/contact"
                        className={navClass}
                    >
                        Contact
                    </NavLink>
                </nav>

                <div className="site-header__actions">
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}

export default Header;
