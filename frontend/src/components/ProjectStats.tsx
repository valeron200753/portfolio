import { projects } from "../data/projects";
import { useState, useMemo, useCallback } from "react";
import StatsButton from "./StatsButton";

function ProjectStats() {
    const [count, setCount] = useState(0);

    const totalProjects = projects.length;

    const completedProjects = useMemo(() => {
        console.log("Calculating completed projects...");

        return projects.filter(
            (project) => project.completed
        ).length;
    }, []);
    const handleHello = useCallback(() => {
        console.log("Hello from ProjectStats!");
    }, []);
    return (
        <section>
            <h2>Project Statistics</h2>

            <p>Total projects: {totalProjects}</p>
            <p>Completed projects: {completedProjects}</p>
            <p>Counter: {count}</p>

            <button onClick={() => setCount(count + 1)}>
                Re-render component
            </button>
            <StatsButton onClick={handleHello} />
        </section>
    );
}

export default ProjectStats;