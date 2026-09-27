interface HeroProps {
    name: string;
    role: string;
    description: string;
}

function Hero({ name, role, description }: HeroProps) {
    return (
        <section id="hero">
            <h1>Hi, I'm {name}</h1>
            <p>{role}</p>
            <p>{description}</p>

            <button>
                Contact me
            </button>
        </section>
    );
}

export default Hero;