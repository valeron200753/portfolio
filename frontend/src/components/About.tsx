
interface AboutProps {
    information: string;
}

const focusAreas = [
    {
        number: "01",
        title: "Frontend Development",
        description:
            "Building responsive interfaces with React, TypeScript and modern CSS."
    },
    {
        number: "02",
        title: "Backend Engineering",
        description:
            "Creating REST APIs, authentication flows and database-driven features."
    },
    {
        number: "03",
        title: "Quality & Reliability",
        description:
            "Using automated testing, validation and error handling to improve software."
    }
];

function About({ information }: AboutProps) {
    return (
        <section
            id="about"
            className="home-section about-section"
            aria-labelledby="about-title"
        >
            <div className="home-section__heading">
                <span className="home-section__eyebrow">
                    01 / ABOUT ME
                </span>

                <h2
                    id="about-title"
                    className="home-section__title"
                >
                    More than just{" "}
                    <span>writing code.</span>
                </h2>

                <p className="home-section__description">
                    {information}
                </p>
            </div>

            <div className="about-section__content">
                <div className="about-section__statement">
                    <span className="about-section__label">
                        MY APPROACH
                    </span>

                    <h3>
                        Learn deeply.
                        <br />
                        Build thoughtfully.
                        <br />
                        Keep improving.
                    </h3>

                    <p>
                        I enjoy understanding how different parts
                        of an application connect — from the user
                        interface to the API and database.
                    </p>

                    <p>
                        My focus is on writing understandable
                        code, solving real problems and
                        continuously improving my engineering
                        skills.
                    </p>
                </div>

                <div className="about-section__cards">
                    {focusAreas.map((area) => (
                        <article
                            key={area.number}
                            className="about-focus-card"
                        >
                            <span className="about-focus-card__number">
                                {area.number}
                            </span>

                            <div>
                                <h3>{area.title}</h3>
                                <p>{area.description}</p>
                            </div>

                            <span
                                className="about-focus-card__symbol"
                                aria-hidden="true"
                            >
                                ↗
                            </span>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default About;
