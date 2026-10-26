
import Contact from "../components/Contact";
import "../styles/contact.css";

const publicContactEmail =
    import.meta.env.VITE_CONTACT_EMAIL ?? "";

function ContactPage() {
    return (
        <main className="contact-page">
            <header className="contact-page__header">
                <span className="contact-eyebrow">
                    CONTACT / GET IN TOUCH
                </span>

                <h1>
                    Let's build something{" "}
                    <span>meaningful.</span>
                </h1>

                <p>
                    Open to conversations about web
                    development, collaboration and
                    new opportunities.
                </p>
            </header>


            <Contact
                email={publicContactEmail}
                githubUrl="https://github.com/valeron200753"
                linkedinUrl="https://www.linkedin.com/in/valerii-ivanichev-0b8206351/"
            />

        </main>
    );
}

export default ContactPage;
