
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import GitHubProfile from "../components/GitHubProfile";

import "../styles/home-sections.css";

function Home() {
    return (
        <main>
            <Hero
                name="Tokyo"
                role="Junior Full-Stack Developer"
                description="I build practical web applications with React, TypeScript and Node.js — from responsive interfaces to backend APIs."
            />

            <About
                information="I'm a software engineering graduate building my skills through hands-on full-stack projects. I work with frontend interfaces, backend APIs, databases, authentication and automated testing."
            />

            <Skills />

            <GitHubProfile />
        </main>
    );
}

export default Home;
