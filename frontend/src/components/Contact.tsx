interface ContactProps {
    email: string;
    githubUrl: string;
}

function Contact({ email, githubUrl }: ContactProps) {
    return (
        <section id="contact">
            <h2>Contact</h2>

            <p>
                Email:{" "}
                <a href={`mailto:${email}`}>
                    {email}
                </a>
            </p>

            <p>
                <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub
                </a>
            </p>
        </section>
    );
}

export default Contact;