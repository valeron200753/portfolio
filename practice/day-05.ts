const username: string = "Tokyo";
const age: number = 22;
const isDeveloper: boolean = true;

console.log(username);
console.log(age);
console.log(isDeveloper);



function add(a: number, b: number): number {
    return a + b;
}

console.log(add(5, 10));



const technologies: string[] = [
    "HTML",
    "CSS",
    "JavaScript",
    "React"
];

for (const technology of technologies) {
    console.log(technology);
}





interface User {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
}
const user: User = {
    id: 1,
    name: "Tokyo",
    email: "tokyo@example.com",
    isAdmin: false
};
console.log(`${user.name} - ${user.isAdmin}`);





interface Project {
    id: number;
    title: string;
    technology: string;
    completed: boolean;
    github?: string;
}
const projects: Project[] = [
    {
        id: 1,
        title: "Portfolio",
        technology: "JavaScript",
        completed: true,
        github: "https://github.com/valeron200753/portfolio"
    },
    {
        id: 2,
        title: "Task Manager",
        technology: "React",
        completed: false
    },
    {
        id: 3,
        title: "Weather App",
        technology: "JavaScript",
        completed: true
    }
];




const completedProjects = projects.filter(
    project => project.completed === true
);
for (const project of completedProjects) {
    console.log(project.title);
}






function findProjectById(id: number): Project | undefined {
    return projects.find(
        project => project.id === id
    );
}


const foundProject = findProjectById(2);

if (foundProject !== undefined) {
    console.log(foundProject.title);
}
const unknownProject = findProjectById(100);

console.log(unknownProject);



type ProjectStatus = "completed" | "progress";
function getProjectStatus(project: Project): ProjectStatus {
    if (project.completed) {
        return "completed";
    }

    return "progress";
}
for (const project of projects) {
    console.log(
        `${project.title} - ${getProjectStatus(project)}`
    );
}

