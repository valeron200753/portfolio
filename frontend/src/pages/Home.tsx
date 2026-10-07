import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import GitHubProfile from "../components/GitHubProfile";
import ReducerCounter from "../components/ReducerCounter";

function Home() {
    return (
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

            <GitHubProfile />

            <ReducerCounter />
        </main>
    );
}

export default Home;