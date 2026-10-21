
import { Link, useParams } from "react-router-dom";

import { projects } from "../data/projects";
import "../styles/projects.css";

function ProjectDetailsPage() {
    const { id } = useParams();

    const project = projects.find(
        (item) => String(item.id) === id
    );

    if (!project) {
        return (
            <main className="project-detail-page">
                <section className="project-detail__not-found">
                    <span className="project-detail__eyebrow">
                        PROJECT NOT FOUND
                    </span>

                    <h1>Nothing here<span>.</span></h1>

                    <p>
                        This project doesn't exist or
                        is no longer available.
                    </p>

                    <Link
                        to="/projects"
                        className="project-detail__button"
                    >
                        ← Back to Projects
                    </Link>
                </section>
            </main>
        );
    }

    const projectNumber = String(
        project.id
    ).padStart(2, "0");

    return (
        <main className="project-detail-page">
            <Link
                to="/projects"
                className="project-detail__back"
            >
                <span aria-hidden="true">←</span>
                All Projects
            </Link>

            <header className="project-detail__header">
                <span className="project-detail__eyebrow">
                    SELECTED WORK / PROJECT {projectNumber}
                </span>

                <h1 className="project-detail__title">
                    {project.title}<span>.</span>
                </h1>

                <p className="project-detail__subtitle">
                    {project.description}
                </p>

                <div className="project-detail__metadata">
                    <span className="project-detail__technology">
                        {project.technology}
                    </span>

                    <span
                        className={
                            `project-detail__status ${
                                project.completed
                                    ? "is-completed"
                                    : "is-progress"
                            }`
                        }
                    >
                        <span aria-hidden="true" />
                        {project.completed
                            ? "Completed"
                            : "In progress"}
                    </span>
                </div>
            </header>

            <div className="project-detail__preview">
                <span className="project-detail__preview-label">
                    TOKYO.DEV / PROJECT {projectNumber}
                </span>

                <span
                    className="project-detail__preview-number"
                    aria-hidden="true"
                >
                    {projectNumber}
                </span>

                <span className="project-detail__preview-footer">
                    SOFTWARE DEVELOPMENT
                    <span aria-hidden="true">↗</span>
                </span>
            </div>

            <div className="project-detail__content">
                <section
                    className="project-detail__overview"
                    aria-labelledby="overview-title"
                >
                    <span className="project-detail__eyebrow">
                        01 / OVERVIEW
                    </span>

                    <h2 id="overview-title">
                        About this project
                    </h2>

                    <p>{project.description}</p>

                    {project.demoPath && (
                        <Link
                            to={project.demoPath}
                            className="project-detail__button"
                        >
                            Open interactive demo
                            <span aria-hidden="true"> ↗</span>
                        </Link>
                    )}
                </section>

                <aside className="project-detail__facts">
                    <span className="project-detail__eyebrow">
                        PROJECT INFORMATION
                    </span>

                    <dl>
                        <div>
                            <dt>Technology</dt>
                            <dd>{project.technology}</dd>
                        </div>

                        <div>
                            <dt>Status</dt>
                            <dd>
                                {project.completed
                                    ? "Completed"
                                    : "In progress"}
                            </dd>
                        </div>

                        <div>
                            <dt>Project number</dt>
                            <dd>{projectNumber}</dd>
                        </div>
                    </dl>
                </aside>
            </div>

            <div className="project-detail__footer">
                <div>
                    <span className="project-detail__eyebrow">
                        CONTINUE EXPLORING
                    </span>

                    <h2>More projects await<span>.</span></h2>
                </div>

                <Link
                    to="/projects"
                    className="project-detail__button"
                >
                    View all projects
                    <span aria-hidden="true"> ↗</span>
                </Link>
            </div>
        </main>
    );
}

export default ProjectDetailsPage;
