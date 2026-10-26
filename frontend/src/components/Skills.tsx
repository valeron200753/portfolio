
const skillGroups = [
    {
        number: "01",
        title: "Frontend",
        description:
            "Building interfaces and interactive web experiences.",
        skills: [
            "HTML5",
            "CSS3",
            "JavaScript",
            "TypeScript",
            "React"
        ]
    },
    {
        number: "02",
        title: "Backend",
        description:
            "Creating APIs and connecting application logic.",
        skills: [
            "Node.js",
            "Express",
            "REST APIs",
            "Authentication"
        ]
    },
    {
        number: "03",
        title: "Database",
        description:
            "Working with structured data and persistence.",
        skills: [
            "SQLite",
            "SQL",
            "Database Design"
        ]
    },
    {
        number: "04",
        title: "Developer Tools",
        description:
            "Version control, development and testing workflows.",
        skills: [
            "Git",
            "GitHub",
            "Linux",
            "Vitest",
            "React Testing Library"
        ]
    }
];

function Skills() {
    return (
        <section
            id="skills"
            className="home-section skills-section"
            aria-labelledby="skills-title"
        >
            <div className="home-section__heading">
                <span className="home-section__eyebrow">
                    02 / TECH STACK
                </span>

                <h2
                    id="skills-title"
                    className="home-section__title"
                >
                    Technologies I{" "}
                    <span>work with.</span>
                </h2>

                <p className="home-section__description">
                    A growing set of technologies and tools
                    I use to build, test and maintain
                    full-stack applications.
                </p>
            </div>

            <div className="skills-section__grid">
                {skillGroups.map((group) => (
                    <article
                        key={group.number}
                        className="skill-card"
                    >
                        <div className="skill-card__top">
                            <span className="skill-card__number">
                                {group.number}
                            </span>
                        </div>

                        <h3>{group.title}</h3>

                        <p className="skill-card__description">
                            {group.description}
                        </p>

                        <ul className="skill-card__tags">
                            {group.skills.map((skill) => (
                                <li key={skill}>
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default Skills;
