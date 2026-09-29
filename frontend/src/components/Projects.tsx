import { useState } from "react";

function Projects() {
    const [showCompletedOnly, setShowCompletedOnly] = useState(false);

    const projects = [
        {
            id: 1,
            title: "Portfolio",
            technology: "React + TypeScript",
            completed: false
        },
        {
            id: 2,
            title: "Task Manager",
            technology: "React",
            completed: true
        },
        {
            id: 3,
            title: "Weather App",
            technology: "JavaScript",
            completed: true
        }
    ];

    const visibleProjects = showCompletedOnly
        ? projects.filter(project => project.completed)
        : projects;

    return (
        <section id="projects">
            <h2>Projects</h2>

            <button
                onClick={() =>
                    setShowCompletedOnly(!showCompletedOnly)
                }
            >
                {showCompletedOnly
                    ? "Show all projects"
                    : "Show completed only"}
            </button>

            <div>
                {visibleProjects.map(project => (
                    <article key={project.id}>
                        <h3>{project.title}</h3>
                        <p>{project.technology}</p>

                        <p>
                            {project.completed
                                ? "Completed"
                                : "In progress"}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default Projects;