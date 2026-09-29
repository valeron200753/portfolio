import { useState } from "react";

interface HeroProps {
    name: string;
    role: string;
    description: string;
}

function Hero({ name, role, description }: HeroProps) {
    const [showMessage, setShowMessage] = useState(false);

    function handleContactClick() {
        setShowMessage(!showMessage);
    }

    return (
        <section id="hero">
            <h1>Hi, I'm {name}</h1>

            <p>{role}</p>

            <p>{description}</p>

            <button onClick={handleContactClick}>
                {showMessage ? "Hide contact info" : "Contact me"}
            </button>

            {showMessage && (
                <p>
                    You can contact me in the section below.
                </p>
            )}
        </section>
    );
}

export default Hero;