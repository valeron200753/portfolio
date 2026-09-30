import { useState, type FormEvent } from "react";
type Subject = "general" | "job" | "project";
type FormStatus = "idle" | "error" | "success";
interface ContactProps {
    email: string;
    githubUrl: string;
}

function Contact({ email, githubUrl }: ContactProps) {
    const [name, setName] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [message, setMessage] = useState("");
    const [formMessage, setFormMessage] = useState("");
    const [subject, setSubject] = useState<Subject>("general");
    const [formStatus, setFormStatus] = useState<FormStatus>("idle");

    function clearFormFeedback() {
        setFormStatus("idle");
        setFormMessage("");
    }
    function validateForm(): string | null {
        if (
            name.trim() === "" ||
            formEmail.trim() === "" ||
            message.trim() === ""
        ) {
            return "Please fill in all fields";
        }

        if (!formEmail.includes("@")) {
            return "Please enter a valid email";
        }

        if (message.trim().length < 10) {
            return "Message must contain at least 10 characters";
        }

        return null;
    }
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationError = validateForm();

        if (validationError) {
            setFormMessage(validationError);
            setFormStatus("error");
            return;
        }

        setFormMessage(
            `Thank you, ${name}! Subject: ${subject}. I'll contact you soon.`
        );

        setFormStatus("success");

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
                    onChange={(event) => {
                        setName(event.target.value);
                        clearFormFeedback();
                    }}
                />

                <input
                    type="email"
                    placeholder="Your email"
                    value={formEmail}
                    onChange={(event) => {
                        setFormEmail(event.target.value);
                        clearFormFeedback();
                    }}
                />
                <select
                    value={subject}
                    onChange={(event) => {
                        setSubject(event.target.value as Subject);
                        clearFormFeedback();
                    }}
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
                    maxLength={200}
                    onChange={(event) => {
                        setMessage(event.target.value);
                        clearFormFeedback();
                    }}
                />

                <p>{message.length} / 200</p>

                <button type="submit">
                    Send
                </button>
            </form>
            {formStatus === "error" && (
                <p>❌ {formMessage}</p>
            )}

            {formStatus === "success" && (
                <p>✅ {formMessage}</p>
            )}
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