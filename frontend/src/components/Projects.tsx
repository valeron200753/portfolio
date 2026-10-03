import { useState } from "react";
import { Link } from "react-router-dom";
import { projects } from "../data/projects";
function Projects() {
    const [showCompletedOnly, setShowCompletedOnly] = useState(false);

   

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

                        <Link to={`/projects/${project.id}`}>
                            View project
                        </Link>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default Projects;