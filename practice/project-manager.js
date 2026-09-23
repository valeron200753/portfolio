const projects = [
    {
        id: 1,
        title: "Portfolio",
        technology: "JavaScript",
        completed: true
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
    },
    {
        id: 4,
        title: "API",
        technology: "Node.js",
        completed: false
    }
];


// 1. Вивести всі назви проєктів
for (const project of projects) {
    console.log(project.title);
}


// 2. Знайти завершені проєкти
const completedProjects = projects.filter(
    project => project.completed === true
);

for (const project of completedProjects) {
    console.log(project.title);
}


// 3. Знайти JavaScript-проєкти
const javaProjects = projects.filter(
    project => project.technology === "JavaScript"
);

for (const project of javaProjects) {
    console.log(project.title);
}


// 4. Знайти проєкт з id === 4
const fourthProject = projects.find(
    project => project.id === 4
);

console.log(fourthProject.title);


// 5. Створити масив тільки з назвами проєктів
const projectTitles = projects.map(
    project => project.title
);

console.log(projectTitles);


// 6. Отримати статус проєкту
function getProjectStatus(project) {
    if (project.completed === true) {
        return "Completed";
    } else {
        return "In progress";
    }
}

for (const project of projects) {
    console.log(
        `${project.title} - ${getProjectStatus(project)}`
    );
}


// Challenge: знайти проєкт за ID
function findProjectById(id) {
    const project = projects.find(
        project => project.id === id
    );

    if (project === undefined) {
        return "Project not found";
    }

    return project;
}

const foundProject = findProjectById(2);

console.log(foundProject.title);

console.log(findProjectById(100));