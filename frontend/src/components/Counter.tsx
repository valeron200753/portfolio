import { useState } from "react";

function Counter() {
    const [count, setCount] = useState(0);

    function upCountClick() {
        setCount(count + 1);
    }

    function downCountClick() {
        setCount(count - 1);
    }

    function resetCount() {
       setCount(0);
    }

    return (
        <section id="counter">
            <h2>Count: {count}</h2>

            <button onClick={upCountClick}>
                +1
            </button>

            <button onClick={downCountClick}>
                -1
            </button>
            <button onClick={resetCount}>
                Reset
            </button>
        </section>
    );
}

export default Counter;