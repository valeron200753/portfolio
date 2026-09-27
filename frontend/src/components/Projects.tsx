function Projects() {
    const projects = [
        {
            id: 1,
            title: "Portfolio",
            technology: "React + TypeScript"
        },
        {
            id: 2,
            title: "Task Manager",
            technology: "React"
        },
        {
            id: 3,
            title: "Weather App",
            technology: "JavaScript"
        }
    ];

    return (
        <section id="projects">
            <h2>Projects</h2>

            <div>
                {projects.map(project => (
                    <article key={project.id}>
                        <h3>{project.title}</h3>
                        <p>{project.technology}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default Projects;