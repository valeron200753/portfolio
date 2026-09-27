function Skills() {
    const skills = [
        "HTML",
        "CSS",
        "JavaScript",
        "TypeScript",
        "React",
        "Git",
        "Linux"
    ];

    return (
        <section id="skills">
            <h2>Skills</h2>

            <ul>
                {skills.map(skill => (
                    <li key={skill}>
                        {skill}
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default Skills;