
import { useMemo } from "react";
import {
    Link,
    useSearchParams
} from "react-router-dom";

import {
    projects,
    projectStatusLabels,
    projectStatusClasses,
    type ProjectStatus
} from "../data/projects";

const technologies = [
    ...new Set(
        projects.map((project) => project.technology)
    )
].sort();

function Projects() {
    const [searchParams, setSearchParams] =
        useSearchParams();

    const status = searchParams.get("status");
    const technology = searchParams.get("technology");
    const search = searchParams.get("search") ?? "";

    const selectedStatus: ProjectStatus | null =
        status === "planned" ||
            status === "in-progress" ||
            status === "completed"
            ? status
            : null;

    const hasFilters = Boolean(
        status || technology || search
    );

    // Оновлюємо лише один параметр URL,
    // зберігаючи всі інші фільтри.
    function updateFilter(
        key: "technology" | "search",
        value: string
    ) {
        setSearchParams(
            (current) => {
                const next = new URLSearchParams(current);

                if (value.trim() === "") {
                    next.delete(key);
                } else {
                    next.set(key, value);
                }

                return next;
            },
            { replace: key === "search" }
        );
    }


    function toggleStatus(nextStatus: ProjectStatus) {
        setSearchParams((current) => {
            const next = new URLSearchParams(current);

            if (next.get("status") === nextStatus) {
                next.delete("status");
            } else {
                next.set("status", nextStatus);
            }

            return next;
        });
    }


    const visibleProjects = useMemo(() => {
        const normalizedSearch =
            search.trim().toLowerCase();

        return projects.filter((project) => {
            const matchesStatus =
                !selectedStatus ||
                project.status === selectedStatus;

            const matchesTechnology =
                !technology ||
                project.technology === technology;

            const searchableText = [
                project.title,
                project.description,
                project.technology
            ].join(" ").toLowerCase();

            const matchesSearch =
                searchableText.includes(normalizedSearch);

            return (
                matchesStatus &&
                matchesTechnology &&
                matchesSearch
            );
        });
    }, [selectedStatus, technology, search]);

    return (
        <section
            id="projects"
            className="portfolio-projects"
            aria-labelledby="projects-list-title"
        >
            <div className="portfolio-projects__heading">
                <div>
                    <span className="portfolio-projects__eyebrow">
                        PROJECT COLLECTION
                    </span>

                    <h2 id="projects-list-title">
                        Explore the work<span>.</span>
                    </h2>

                    <p>
                        Browse projects by technology, progress
                        and the problems they explore.
                    </p>
                </div>

                <span className="portfolio-projects__total">
                    {projects.length} projects
                </span>
            </div>

            {/* FILTERS */}

            <div className="project-filters">
                <div className="project-filters__fields">
                    <div className="project-filters__search">
                        <label htmlFor="project-search">
                            Search projects
                        </label>

                        <input
                            id="project-search"
                            type="search"
                            placeholder="Search by name or technology..."
                            value={search}
                            onChange={(event) => {
                                updateFilter(
                                    "search",
                                    event.target.value
                                );
                            }}
                        />
                    </div>

                    <div className="project-filters__technology">
                        <label htmlFor="project-technology">
                            Technology
                        </label>

                        <select
                            id="project-technology"
                            value={technology ?? ""}
                            onChange={(event) => {
                                updateFilter(
                                    "technology",
                                    event.target.value
                                );
                            }}
                        >
                            <option value="">
                                All technologies
                            </option>

                            {technologies.map((item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="project-filters__footer">
                    <div className="project-filters__actions">

                        {(
                            ["completed", "in-progress", "planned"] as const
                        ).map((item) => (
                            <button
                                key={item}
                                type="button"
                                className={`project-filters__toggle ${selectedStatus === item
                                    ? "is-active"
                                    : ""
                                    }`}
                                aria-pressed={selectedStatus === item}
                                onClick={() => toggleStatus(item)}
                            >
                                <span aria-hidden="true">
                                    {item === "completed"
                                        ? "✓"
                                        : item === "in-progress"
                                            ? "◷"
                                            : "○"}
                                </span>

                                {projectStatusLabels[item]}
                            </button>
                        ))}


                        <button
                            type="button"
                            className="project-filters__reset"
                            onClick={() => setSearchParams({})}
                            disabled={!hasFilters}
                        >
                            Reset filters
                        </button>
                    </div>

                    <p
                        className="project-filters__count"
                        role="status"
                        aria-live="polite"
                    >
                        Showing {visibleProjects.length} of{" "}
                        {projects.length} projects
                    </p>
                </div>
            </div>

            {/* PROJECT CARDS */}

            {visibleProjects.length === 0 ? (
                <div className="portfolio-projects__empty">
                    <span aria-hidden="true">⌕</span>

                    <h3>No projects found</h3>

                    <p>
                        Try another search term or clear
                        the selected filters.
                    </p>

                    <button
                        type="button"
                        onClick={() => setSearchParams({})}
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="projects-grid">
                    {visibleProjects.map((project) => (
                        <article
                            key={project.id}
                            className="project-card"
                        >
                            <div
                                className="project-card__preview"
                                aria-hidden="true"
                            >
                                <span className="project-card__preview-label">
                                    PROJECT /{" "}
                                    {String(project.id).padStart(2, "0")}
                                </span>

                                <span className="project-card__preview-number">
                                    {String(project.id).padStart(2, "0")}
                                </span>

                                <span className="project-card__preview-symbol">
                                    {"</>"}
                                </span>
                            </div>

                            <div className="project-card__body">
                                <div className="project-card__metadata">
                                    <span className="project-card__technology">
                                        {project.technology}
                                    </span>


                                    <span
                                        className={`project-card__status ${projectStatusClasses[project.status]
                                            }`}
                                    >
                                        <span aria-hidden="true" />

                                        {projectStatusLabels[project.status]}
                                    </span>

                                </div>

                                <h3>{project.title}</h3>

                                <p className="project-card__description">
                                    {project.description}
                                </p>

                                <Link
                                    to={`/projects/${project.id}`}
                                    className="project-card__link"
                                    aria-label={
                                        `View details for ${project.title}`
                                    }
                                >
                                    View details
                                    <span aria-hidden="true">↗</span>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default Projects;
