
export type ProjectStatus =
    | "planned"
    | "in-progress"
    | "completed";

export interface Project {
    id: number;
    title: string;
    technology: string;
    status: ProjectStatus;
    description: string;
    demoPath?: string;
}

export const projectStatusLabels: Record<
    ProjectStatus,
    string
> = {
    planned: "Planned",
    "in-progress": "In Progress",
    completed: "Completed"
};

export const projectStatusClasses: Record<
    ProjectStatus,
    string
> = {
    planned: "is-planned",
    "in-progress": "is-progress",
    completed: "is-completed"
};

export const projects: Project[] = [
    {
        id: 1,
        title: "Portfolio",
        technology: "React + TypeScript",
        status: "in-progress",
        description:
            "An evolving personal developer portfolio with responsive design, project showcases, and light/dark themes."
    },
    {
        id: 2,
        title: "Task Manager",
        technology: "React + TypeScript, Express, SQLite",
        status: "completed",
        description:
            "A full-stack task management application with session-based authentication, personal task creation, completion tracking, deletion, search, status filters, and progress statistics.",
        demoPath: "/tasks"
    },
    {
        id: 3,
        title: "Weather App",
        technology: "JavaScript (planned)",
        status: "planned",
        description:
            "A planned weather application. Development has not started yet."
    }
];
