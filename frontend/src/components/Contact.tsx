
import { useState, type FormEvent } from "react";

type Subject = "general" | "job" | "project";
type FormStatus = "idle" | "error" | "ready";

interface ContactProps {
    email: string;
    githubUrl: string;
    linkedinUrl?: string;
}

const subjectLabels: Record<Subject, string> = {
    general: "General question",
    job: "Job opportunity",
    project: "Project collaboration"
};

function Contact({
    email,
    githubUrl,
    linkedinUrl
}: ContactProps) {
    const [name, setName] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [subject, setSubject] =
        useState<Subject>("general");
    const [message, setMessage] = useState("");

    const [formStatus, setFormStatus] =
        useState<FormStatus>("idle");
    const [formMessage, setFormMessage] = useState("");
    const [draftUrl, setDraftUrl] =
        useState<string | null>(null);

    const contactEmail = email.trim();

    const emailConfigured =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) &&
        !/@example\.(com|org|net)$/i.test(contactEmail);

    function clearFeedback() {
        setFormStatus("idle");
        setFormMessage("");
        setDraftUrl(null);
    }

    function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        clearFeedback();

        if (!emailConfigured) {
            setFormStatus("error");
            setFormMessage(
                "The contact email is not configured yet."
            );
            return;
        }

        if (
            !name.trim() ||
            !formEmail.trim() ||
            !message.trim()
        ) {
            setFormStatus("error");
            setFormMessage("Please fill in all fields.");
            return;
        }

        const validEmail =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formEmail.trim()
            );

        if (!validEmail) {
            setFormStatus("error");
            setFormMessage(
                "Please enter a valid email address."
            );
            return;
        }

        if (message.trim().length < 10) {
            setFormStatus("error");
            setFormMessage(
                "Your message must contain at least 10 characters."
            );
            return;
        }

        const emailSubject =
            `[TOKYO.DEV] ${subjectLabels[subject]}`;

        const emailBody = [
            `Name: ${name.trim()}`,
            `Email: ${formEmail.trim()}`,
            `Subject: ${subjectLabels[subject]}`,
            "",
            message.trim(),
            "",
            `Reply to: ${formEmail.trim()}`
        ].join("\n");

        const url =
            `mailto:${contactEmail}` +
            `?subject=${encodeURIComponent(emailSubject)}` +
            `&body=${encodeURIComponent(emailBody)}`;

        setDraftUrl(url);
        setFormStatus("ready");
        setFormMessage(
            "Your email draft is ready. Open it in your email app and send it manually."
        );
    }

    return (
        <section
            id="contact"
            className="contact-layout"
            aria-label="Contact information and message form"
        >
            <div className="contact-info">
                <div className="contact-info__intro">
                    <span className="contact-eyebrow">
                        LET'S CONNECT
                    </span>

                    <h2>
                        Start a <span>conversation.</span>
                    </h2>

                    <p>
                        If you'd like to discuss a job opportunity,
                        collaborate on a project, or ask a question
                        about my work, I'd be happy to hear from you.
                    </p>
                </div>

                <div className="contact-method">
                    <div
                        className="contact-method__icon"
                        aria-hidden="true"
                    >
                        @
                    </div>

                    <div>
                        <span className="contact-method__label">
                            EMAIL
                        </span>

                        <h3>Direct contact</h3>

                        {emailConfigured ? (
                            <a href={`mailto:${contactEmail}`}>
                                {contactEmail}
                                <span aria-hidden="true"> ↗</span>
                            </a>
                        ) : (
                            <p>
                                Email address coming soon.
                            </p>
                        )}
                    </div>
                </div>

                {linkedinUrl?.trim() && (
                    <div className="contact-method">
                        <div
                            className="contact-method__icon"
                            aria-hidden="true"
                        >
                            in
                        </div>

                        <div>
                            <span className="contact-method__label">
                                LINKEDIN
                            </span>

                            <h3>Professional network</h3>

                            <a
                                href={linkedinUrl.trim()}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View LinkedIn profile
                                <span aria-hidden="true"> ↗</span>
                            </a>
                        </div>
                    </div>
                )}

                <div className="contact-method">
                    <div
                        className="contact-method__icon"
                        aria-hidden="true"
                    >
                        {"</>"}
                    </div>

                    <div>
                        <span className="contact-method__label">
                            GITHUB
                        </span>

                        <h3>Explore my code</h3>

                        <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            valeron200753
                            <span aria-hidden="true"> ↗</span>
                        </a>
                    </div>
                </div>

                <div className="contact-info__note">
                    <span aria-hidden="true">✦</span>
                    Interested in frontend, backend and
                    full-stack development opportunities.
                </div>
            </div>

            <div className="contact-form-card">
                <div className="contact-form-card__heading">
                    <span className="contact-eyebrow">
                        MESSAGE FORM
                    </span>

                    <h2 id="contact-form-title">
                        Tell me about your idea.
                    </h2>

                    <p>
                        Fill out the form to prepare an email
                        in your preferred mail application.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="contact-form"
                    aria-labelledby="contact-form-title"
                    noValidate
                >
                    <div className="contact-form__row">
                        <div className="contact-form__field">
                            <label htmlFor="contact-name">
                                Your name
                            </label>

                            <input
                                id="contact-name"
                                type="text"
                                value={name}
                                placeholder="Your name"
                                autoComplete="name"
                                maxLength={80}
                                required
                                onChange={(event) => {
                                    setName(event.target.value);
                                    clearFeedback();
                                }}
                            />
                        </div>

                        <div className="contact-form__field">
                            <label htmlFor="contact-email">
                                Your email
                            </label>

                            <input
                                id="contact-email"
                                type="email"
                                value={formEmail}
                                placeholder="you@example.com"
                                autoComplete="email"
                                maxLength={254}
                                required
                                onChange={(event) => {
                                    setFormEmail(event.target.value);
                                    clearFeedback();
                                }}
                            />
                        </div>
                    </div>

                    <div className="contact-form__field">
                        <label htmlFor="contact-subject">
                            Subject
                        </label>

                        <select
                            id="contact-subject"
                            value={subject}
                            onChange={(event) => {
                                setSubject(
                                    event.target.value as Subject
                                );
                                clearFeedback();
                            }}
                        >
                            <option value="general">
                                General question
                            </option>

                            <option value="job">
                                Job opportunity
                            </option>

                            <option value="project">
                                Project collaboration
                            </option>
                        </select>
                    </div>

                    <div className="contact-form__field">
                        <label htmlFor="contact-message">
                            Your message
                        </label>

                        <textarea
                            id="contact-message"
                            value={message}
                            placeholder="Tell me what you have in mind..."
                            rows={6}
                            maxLength={200}
                            minLength={10}
                            required
                            aria-describedby="contact-message-count"
                            onChange={(event) => {
                                setMessage(event.target.value);
                                clearFeedback();
                            }}
                        />

                        <div
                            id="contact-message-count"
                            className="contact-form__counter"
                        >
                            {message.length} / 200 characters
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="contact-form__submit"
                    >
                        Prepare email
                        <span aria-hidden="true"> ↗</span>
                    </button>

                    <p className="contact-form__disclaimer">
                        This form prepares an email draft.
                        It does not automatically send messages.
                    </p>
                </form>

                {formStatus === "error" && (
                    <div
                        className="contact-form__feedback is-error"
                        role="alert"
                    >
                        {formMessage}
                    </div>
                )}

                {formStatus === "ready" && draftUrl && (
                    <div
                        className="contact-form__feedback is-ready"
                        role="status"
                    >
                        <p>{formMessage}</p>

                        <a
                            href={draftUrl}
                            className="contact-form__draft-link"
                        >
                            Open email app ↗
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
}

export default Contact;
