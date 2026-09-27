interface AboutProps {
    information: string;
}

function About({ information }: AboutProps) {
    return (
        <section id="about">
            <h2>About me</h2>
            <p>{information}</p>
        </section>
    );
}

export default About;