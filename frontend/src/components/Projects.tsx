
import { Link, useSearchParams } from "react-router-dom";
import { projects } from "../data/projects";
import { useCallback, useMemo } from "react";

function Projects() {
    const [searchParams, setSearchParams] = useSearchParams();

    const status = searchParams.get("status");
    const technology = searchParams.get("technology");
    const search = searchParams.get("search") ?? "";


    const toggleCompletedProjects = useCallback(() => {
    setSearchParams((currentParams) => {
        const newParams = new URLSearchParams(currentParams);

        if (newParams.get("status") === "completed") {
            newParams.delete("status");
        } else {
            newParams.set("status", "completed");
        }

        return newParams;
    });
}, [setSearchParams]);




    const visibleProjects = useMemo(() => {
        console.log("Filtering projects...");

        return projects.filter((project) => {
            const matchesStatus =
                status === "completed"
                    ? project.completed
                    : true;

            const matchesTechnology =
                technology
                    ? project.technology === technology
                    : true;

            const matchesSearch = project.title
                .toLowerCase()
                .includes(search.toLowerCase());

            return (
                matchesStatus &&
                matchesTechnology &&
                matchesSearch
            );
        });
    }, [status, technology, search]);

    return (

        <section id="projects">

            <h2>Projects</h2>
            <p>URL status: {status}</p>
            <button onClick={toggleCompletedProjects}>
                {status === "completed"
                    ? "Show all projects"
                    : "Show completed only"}
            </button>
            <button onClick={() => setSearchParams({})}>
                Reset filters
            </button>
            <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(event) => {
                    const value = event.target.value;

                    const newParams =
                        new URLSearchParams(searchParams);

                    if (value.trim() === "") {
                        newParams.delete("search");
                    } else {
                        newParams.set("search", value);
                    }

                    setSearchParams(newParams);
                }}
            />
            <select
                value={technology ?? ""}
                onChange={(event) => {
                    const value = event.target.value;

                    const newParams = new URLSearchParams(searchParams);

                    if (value === "") {
                        newParams.delete("technology");
                    } else {
                        newParams.set("technology", value);
                    }

                    setSearchParams(newParams);
                }}
            >
                <option value="">All technologies</option>
                <option value="React">React</option>
                <option value="JavaScript">JavaScript</option>
                <option value="React + TypeScript">React + TypeScript</option>
            </select>
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