
import Projects from "../components/Projects";
import ProjectStats from "../components/ProjectStats";

import "../styles/projects.css";

function ProjectsPage() {
    return (
        <main className="projects-page">
            <header className="projects-page__intro">
                <span className="projects-page__eyebrow">
                    PORTFOLIO / SELECTED WORK
                </span>

                <h1>
                    My <span>Projects.</span>
                </h1>

                <p>
                    A collection of web applications and
                    experiments built while exploring frontend,
                    backend and full-stack development.
                </p>
            </header>

            <Projects />

            <div className="projects-page__stats">
                <ProjectStats />
            </div>
        </main>
    );
}

export default ProjectsPage;
