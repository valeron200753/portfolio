import { useState, type FormEvent } from "react";

interface ContactProps {
    email: string;
    githubUrl: string;
}

function Contact({ email, githubUrl }: ContactProps) {
    const [name, setName] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [message, setMessage] = useState("");
    const [formMessage, setFormMessage] = useState("");
    const [subject, setSubject] = useState("general");



    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (
            name.trim() === "" ||
            formEmail.trim() === "" ||
            message.trim() === ""
        ) {
            setFormMessage("Please fill in all fields");
            return;
        }

        setFormMessage(
            `Thank you, ${name}! Subject: ${subject}. I'll contact you soon.`
        );

        setName("");
        setFormEmail("");
        setMessage("");
        setSubject("general");
    }

    return (
        <section id="contact">
            <h2>Contact</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />

                <input
                    type="email"
                    placeholder="Your email"
                    value={formEmail}
                    onChange={(event) => setFormEmail(event.target.value)}
                />
                <select
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                >
                    <option value="general">
                        General question
                    </option>

                    <option value="job">
                        Job offer
                    </option>

                    <option value="project">
                        Project collaboration
                    </option>
                </select>
                <textarea
                    placeholder="Your message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                />

                <p>Characters: {message.length}</p>

                <button type="submit">
                    Send
                </button>
            </form>
            <p>{formMessage}</p>
            <p>Subject: {subject}</p>
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