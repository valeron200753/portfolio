import { useEffect, useState } from "react";

interface GitHubUser {
    login: string;
    avatar_url: string;
    html_url: string;
    public_repos: number;
    followers: number;
    following: number;
}

async function fetchGitHubUser(): Promise<GitHubUser> {
    const response = await fetch(
        "https://api.github.com/users/valeron200753"
    );

    if (!response.ok) {
        throw new Error("Failed to load GitHub profile");
    }

    return response.json();
}

function GitHubProfile() {
    const [user, setUser] = useState<GitHubUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchGitHubUser()
            .then((data) => {
                setUser(data);
            })
            .catch(() => {
                setError("Could not load GitHub profile");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    async function handleRefresh() {
        setLoading(true);
        setError("");

        try {
            const data = await fetchGitHubUser();
            setUser(data);
        } catch {
            setError("Could not load GitHub profile");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <p>Loading GitHub profile...</p>;
    }

    if (error) {
        return (
            <div>
                <p>{error}</p>

                <button onClick={handleRefresh}>
                    Try again
                </button>
            </div>
        );
    }

    return (
        <section id="github">
            <h2>GitHub Profile</h2>

            {user && (
                <div>
                    <img
                        src={user.avatar_url}
                        alt={`${user.login} avatar`}
                        width="120"
                    />

                    <p>Username: {user.login}</p>
                    <p>Repositories: {user.public_repos}</p>
                    <p>Followers: {user.followers}</p>
                    <p>Following: {user.following}</p>

                    <a
                        href={user.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Open GitHub profile
                    </a>

                    <button onClick={handleRefresh}>
                        Refresh profile
                    </button>
                </div>
            )}
        </section>
    );
}

export default GitHubProfile;