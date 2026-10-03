import { Link, useNavigate, useParams } from "react-router-dom";
import { projects } from "../data/projects";

function ProjectDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const project = projects.find(
        (project) => project.id === Number(id)
    );

    if (!project) {
        return (
            <main>
                <h1>Project not found</h1>
                <p>This project does not exist.</p>

                <Link to="/projects">
                    Back to projects
                </Link>
                <button onClick={() => navigate(-1)}>
                    Go back
                </button>
            </main>
        );
    }

    return (
        <main>
            <h1>Project Details</h1>

            <div>
                <h2>{project.title}</h2>
                <p>{project.technology}</p>
                <p>{project.description}</p>
                <p>
                    {project.completed
                        ? "Completed"
                        : "In progress"}
                </p>
            </div>

            <Link to="/projects">
                Back to projects
            </Link>
            <button onClick={() => navigate(-1)}>
                Go back
            </button>
        </main>
    );
}

export default ProjectDetailsPage;