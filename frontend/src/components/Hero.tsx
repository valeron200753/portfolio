
import { Link } from "react-router-dom";
import "./Hero.css";

interface HeroProps {
    name: string;
    role: string;
    description: string;
}

const technologies = [
    "React",
    "TypeScript",
    "Node.js",
    "Express",
    "SQLite"
];

function Hero({ name, role, description }: HeroProps) {
    return (
        <section
            id="hero"
            className="portfolio-hero"
            aria-labelledby="hero-heading"
        >
            {/* LEFT SIDE — INTRODUCTION */}

            <div className="portfolio-hero__content">
                <div className="portfolio-hero__eyebrow">
                    <span
                        className="portfolio-hero__status-dot"
                        aria-hidden="true"
                    />
                    Building & learning
                </div>

                <h1
                    id="hero-heading"
                    className="portfolio-hero__title"
                >
                    Hi, I'm{" "}
                    <span className="portfolio-hero__name">
                        {name}
                        <span aria-hidden="true">.</span>
                    </span>
                </h1>

                <p className="portfolio-hero__role">
                    {role}
                </p>

                <p className="portfolio-hero__description">
                    {description}
                </p>

                <div className="portfolio-hero__actions">
                    <Link
                        to="/projects"
                        className="portfolio-hero__button portfolio-hero__button--primary"
                    >
                        Explore Projects
                        <span aria-hidden="true">↗</span>
                    </Link>

                    <Link
                        to="/contact"
                        className="portfolio-hero__button portfolio-hero__button--secondary"
                    >
                        Contact Me
                        <span aria-hidden="true">→</span>
                    </Link>
                </div>

                <div className="portfolio-hero__stack">
                    <p className="portfolio-hero__stack-label">
                        TECH STACK
                    </p>

                    <ul className="portfolio-hero__technologies">
                        {technologies.map((technology) => (
                            <li key={technology}>
                                {technology}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* RIGHT SIDE — DEVELOPER PREVIEW */}

            <div className="portfolio-hero__visual">
                <div className="portfolio-hero__terminal">
                    <div className="portfolio-hero__terminal-header">
                        <div
                            className="portfolio-hero__window-controls"
                            aria-hidden="true"
                        >
                            <span />
                            <span />
                            <span />
                        </div>

                        <span className="portfolio-hero__filename">
                            developer.ts
                        </span>
                    </div>

                    <div className="portfolio-hero__code">
                        <div className="portfolio-hero__code-line">
                            <span className="portfolio-hero__line-number">
                                01
                            </span>
                            <code>
                                <span className="syntax-keyword">
                                    const
                                </span>
                                {" developer = {"}
                            </code>
                        </div>

                        <div className="portfolio-hero__code-line">
                            <span className="portfolio-hero__line-number">
                                02
                            </span>
                            <code>
                                {"  name: "}
                                <span className="syntax-string">
                                    "{name}"
                                </span>
                                ,
                            </code>
                        </div>

                        <div className="portfolio-hero__code-line">
                            <span className="portfolio-hero__line-number">
                                03
                            </span>
                            <code>
                                {"  role: "}
                                <span className="syntax-string">
                                    "{role}"
                                </span>
                                ,
                            </code>
                        </div>

                        <div className="portfolio-hero__code-line">
                            <span className="portfolio-hero__line-number">
                                04
                            </span>
                            <code>
                                {"  frontend: ["}
                                <span className="syntax-string">
                                    "React"
                                </span>
                                {", "}
                                <span className="syntax-string">
                                    "TypeScript"
                                </span>
                                {"],"}
                            </code>
                        </div>

                        <div className="portfolio-hero__code-line">
                            <span className="portfolio-hero__line-number">
                                05
                            </span>
                            <code>
                                {"  backend: ["}
                                <span className="syntax-string">
                                    "Node.js"
                                </span>
                                {", "}
                                <span className="syntax-string">
                                    "Express"
                                </span>
                                {"],"}
                            </code>
                        </div>

                        <div className="portfolio-hero__code-line">
                            <span className="portfolio-hero__line-number">
                                06
                            </span>
                            <code>
                                {"  database: "}
                                <span className="syntax-string">
                                    "SQLite"
                                </span>
                                ,
                            </code>
                        </div>

                        <div className="portfolio-hero__code-line">
                            <span className="portfolio-hero__line-number">
                                07
                            </span>
                            <code>{"};"}</code>
                        </div>
                    </div>

                    <div className="portfolio-hero__terminal-footer">
                        <span
                            className="portfolio-hero__terminal-indicator"
                            aria-hidden="true"
                        />

                        <span>
                            Frontend · Backend · Database
                        </span>
                    </div>
                </div>

                <div className="portfolio-hero__floating-label">
                    <span aria-hidden="true">✦</span>
                    Built with curiosity
                </div>
            </div>
        </section>
    );
}

export default Hero;
