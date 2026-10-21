
import { projects } from "../data/projects";

function ProjectStats() {
    const totalProjects = projects.length;

    const completedProjects = projects.filter(
        (project) => project.completed
    ).length;

    const activeProjects =
        totalProjects - completedProjects;

    const statistics = [
        {
            number: totalProjects,
            label: "Total Projects",
            description: "Projects in the collection"
        },
        {
            number: completedProjects,
            label: "Completed",
            description: "Marked as finished"
        },
        {
            number: activeProjects,
            label: "In Progress",
            description: "Currently in development"
        }
    ];

    return (
        <section
            className="project-statistics"
            aria-labelledby="project-statistics-title"
        >
            <div className="project-statistics__heading">
                <span className="project-statistics__eyebrow">
                    DEVELOPMENT JOURNEY
                </span>

                <h2 id="project-statistics-title">
                    Work in <span>numbers.</span>
                </h2>

                <p>
                    A quick overview of the projects
                    in my portfolio.
                </p>
            </div>

            <dl className="project-statistics__grid">
                {statistics.map((statistic) => (
                    <div
                        key={statistic.label}
                        className="project-statistics__card"
                    >
                        <dd className="project-statistics__value">
                            {String(statistic.number).padStart(2, "0")}
                        </dd>

                        <dt className="project-statistics__label">
                            {statistic.label}
                        </dt>

                        <p className="project-statistics__description">
                            {statistic.description}
                        </p>
                    </div>
                ))}
            </dl>
        </section>
    );
}

export default ProjectStats;
