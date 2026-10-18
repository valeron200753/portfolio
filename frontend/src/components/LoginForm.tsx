
import { useState, type FormEvent } from "react";

import {
    login,
    type AuthUser
} from "../api/auth";

type LoginFormProps = {
    onSuccess: (user: AuthUser) => void;
};

function LoginForm({ onSuccess }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            const user = await login(email, password);

            setPassword("");
            onSuccess(user);
        } catch (err) {
            const message = err instanceof Error
                ? err.message
                : "Не вдалося виконати вхід";

            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Вхід в акаунт</h2>

            <div>
                <label htmlFor="login-email">
                    Email
                </label>

                <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                    autoComplete="username"
                    placeholder="you@example.com"
                    required
                />
            </div>

            <div>
                <label htmlFor="login-password">
                    Пароль
                </label>

                <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                    autoComplete="current-password"
                    placeholder="Введіть пароль"
                    required
                />
            </div>

            {error && (
                <p role="alert">{error}</p>
            )}

            <button
                type="submit"
                disabled={loading}
            >
                {loading ? "Входимо..." : "Увійти"}
            </button>
        </form>
    );
}

export default LoginForm;
