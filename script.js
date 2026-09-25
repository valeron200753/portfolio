const contactButton = document.querySelector("#contactButton");
const heroTitle = document.querySelector("#heroTitle");

contactButton.addEventListener("click", function () {
    heroTitle.textContent = "Let's work together!";

    document.querySelector("#contact").scrollIntoView({
        behavior: "smooth"
    });
});


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
    }
];


function getProjectStatus(project) {
    if (project.completed === true) {
        return "Completed";
    }

    return "In progress";
}


const projectList = document.querySelector("#projectList");

for (const project of projects) {
    const card = document.createElement("div");
    const title = document.createElement("h3");
    const technology = document.createElement("p");
    const status = document.createElement("p");

    title.textContent = project.title;
    technology.textContent = project.technology;
    status.textContent = getProjectStatus(project);

    card.classList.add("project-card");

    card.appendChild(title);
    card.appendChild(technology);
    card.appendChild(status);

    projectList.appendChild(card);
}


const contactForm = document.querySelector("#contactForm");
const nameInput = document.querySelector("#nameInput");
const emailInput = document.querySelector("#emailInput");
const formMessage = document.querySelector("#formMessage");

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = nameInput.value;
    const email = emailInput.value;

    if (name.trim() === "" || email.trim() === "") {
        formMessage.textContent = "Please fill in all fields";
        return;
    }

    formMessage.textContent =
        `Thank you, ${name}! I'll contact you soon.`;

    nameInput.value = "";
    emailInput.value = "";
});





async function loadGitHubProfile() {
    const githubProfile = document.querySelector("#githubProfile");

    try {
        const response = await fetch(
            "https://api.github.com/users/valeron200753"
        );

        if (!response.ok) {
            throw new Error("GitHub request failed");
        }

        const user = await response.json();

        githubProfile.innerHTML = `
    <img
        src="${user.avatar_url}"
        alt="${user.login}"
        width="120"
    >

    <h3>${user.login}</h3>

    <p>Public repositories: ${user.public_repos}</p>

    <p>Followers: ${user.followers}</p>

    <p>Following: ${user.following}</p>

    <a
        href="${user.html_url}"
        target="_blank"
        rel="noopener noreferrer"
    >
        View GitHub
    </a>
`;

    } catch (error) {
        githubProfile.textContent = "Could not load GitHub profile.";
    }
}

loadGitHubProfile();