import Contact from "../components/Contact";

function ContactPage() {
    return (
        <main>
            <h1>Contact</h1>

            <Contact
                email="tokyo@example.com"
                githubUrl="https://github.com/valeron200753"
            />
        </main>
    );
}

export default ContactPage;