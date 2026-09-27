import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

function App() {
    return (
        <>
            <Header />

            <main>
                <Hero
                    name="Tokyo"
                    role="Junior Full-Stack Developer"
                    description="I build web applications and learn modern full-stack development."
                />

                <About
                    information="I'm learning full-stack development and building web applications with React, TypeScript and Node.js."
                />

                <Skills />

                <Projects />

                <Contact
                    email="tokyo@example.com"
                    githubUrl="https://github.com/valeron200753"
                />
            </main>
        </>
    );
}

export default App;