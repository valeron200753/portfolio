
import { useEffect, useState } from "react";

interface GitHubUser {
    login: string;
    avatar_url: string;
    html_url: string;
    public_repos: number;
    followers: number;
    following: number;
}

async function fetchGitHubUser(
    signal?: AbortSignal
): Promise<GitHubUser> {
    const response = await fetch(
        "https://api.github.com/users/valeron200753",
        { signal }
    );

    if (!response.ok) {
        throw new Error(
            `GitHub API returned HTTP ${response.status}`
        );
    }

    return (await response.json()) as GitHubUser;
}

function GitHubProfile() {
    const [user, setUser] = useState<GitHubUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function loadProfile() {
            try {
                const data = await fetchGitHubUser(
                    controller.signal
                );

                if (!controller.signal.aborted) {
                    setUser(data);
                    setError(null);
                }
            } catch {
                if (!controller.signal.aborted) {
                    setError(
                        "Could not load GitHub profile."
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        void loadProfile();

        return () => {
            controller.abort();
        };
    }, []);

    async function handleRefresh() {
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            const data = await fetchGitHubUser();
            setUser(data);
        } catch {
            setError("Could not load GitHub profile.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section
            id="github"
            className="home-section github-section"
            aria-labelledby="github-title"
            aria-busy={loading}
        >
            <div className="github-section__heading">
                <div className="home-section__heading">
                    <span className="home-section__eyebrow">
                        03 / GITHUB
                    </span>

                    <h2
                        id="github-title"
                        className="home-section__title"
                    >
                        My work,{" "}
                        <span>in the open.</span>
                    </h2>

                    <p className="home-section__description">
                        Explore my repositories, experiments
                        and projects on GitHub.
                    </p>
                </div>

                <button
                    type="button"
                    className="github-section__refresh"
                    onClick={() => void handleRefresh()}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Refresh profile ↻"}
                </button>
            </div>

            {loading && (
                <div
                    className="github-section__feedback"
                    role="status"
                >
                    Loading GitHub profile...
                </div>
            )}

            {!loading && error && (
                <div
                    className="github-section__feedback"
                    role="alert"
                >
                    <p>{error}</p>

                    <button
                        type="button"
                        onClick={() => void handleRefresh()}
                    >
                        Try again
                    </button>
                </div>
            )}

            {!loading && !error && user && (
                <article className="github-profile">
                    <div className="github-profile__identity">
                        <img
                            src={user.avatar_url}
                            alt={`${user.login}'s GitHub avatar`}
                            width={104}
                            height={104}
                            loading="lazy"
                        />

                        <div>
                            <span className="github-profile__label">
                                GITHUB ACCOUNT
                            </span>

                            <h3>{user.login}</h3>

                            <p>
                                Projects, source code and
                                development experiments.
                            </p>
                        </div>
                    </div>

                    <dl className="github-profile__metrics">
                        <div>
                            <dt>Repositories</dt>
                            <dd>{user.public_repos}</dd>
                        </div>

                        <div>
                            <dt>Followers</dt>
                            <dd>{user.followers}</dd>
                        </div>

                        <div>
                            <dt>Following</dt>
                            <dd>{user.following}</dd>
                        </div>
                    </dl>

                    <div className="github-profile__footer">
                        <span className="github-profile__status">
                            <span aria-hidden="true" />
                            Public GitHub profile
                        </span>

                        <a
                            href={user.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="github-profile__link"
                        >
                            View GitHub
                            <span aria-hidden="true"> ↗</span>
                        </a>
                    </div>
                </article>
            )}
        </section>
    );
}

export default GitHubProfile;
