import { useReducer } from "react";

interface CounterState {
    count: number;
    step: number;
}

type CounterAction =
    | { type: "increment" }
    | { type: "decrement" }
    | { type: "reset" }
    | { type: "add"; amount: number }
    | { type: "setStep"; step: number };

const initialState: CounterState = {
    count: 0,
    step: 1
};

function counterReducer(
    state: CounterState,
    action: CounterAction
): CounterState {
    if (action.type === "increment") {
        return {
            ...state,
            count: state.count + state.step
        };
    }

    if (action.type === "decrement") {
        return {
            ...state,
            count: state.count - state.step
        };
    }

    if (action.type === "reset") {
        return initialState;
    }

    if (action.type === "add") {
        return {
            ...state,
            count: state.count + action.amount
        };
    }

    if (action.type === "setStep") {
        return {
            ...state,
            step: action.step
        };
    }

    return state;
}

function ReducerCounter() {
    const [state, dispatch] =
        useReducer(counterReducer, initialState);

    return (
        <section>
            <h2>Reducer Counter</h2>

            <p>Count: {state.count}</p>
            <p>Step: {state.step}</p>

            <select
                value={state.step}
                onChange={(event) =>
                    dispatch({
                        type: "setStep",
                        step: Number(event.target.value)
                    })
                }
            >
                <option value={1}>1</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
            </select>

            <button
                onClick={() =>
                    dispatch({ type: "increment" })
                }
            >
                +
            </button>

            <button
                onClick={() =>
                    dispatch({ type: "decrement" })
                }
            >
                -
            </button>

            <button
                onClick={() =>
                    dispatch({
                        type: "add",
                        amount: 5
                    })
                }
            >
                +5
            </button>

            <button
                onClick={() =>
                    dispatch({ type: "reset" })
                }
            >
                Reset
            </button>
        </section>
    );
}

export default ReducerCounter;