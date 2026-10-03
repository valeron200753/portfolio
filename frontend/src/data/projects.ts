export interface Project {
    id: number;
    title: string;
    technology: string;
    completed: boolean;
    description: string;
}

export const projects: Project[] = [
    {
        id: 1,
        title: "Portfolio",
        technology: "React + TypeScript",
        completed: false,
        description: "My personal portfolio website."
    },
    {
        id: 2,
        title: "Task Manager",
        technology: "React",
        completed: true,
        description: "A simple task management application."
    },
    {
        id: 3,
        title: "Weather App",
        technology: "JavaScript",
        completed: true,
        description: "An application that shows weather information."
    }
];