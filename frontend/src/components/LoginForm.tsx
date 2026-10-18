
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

    // Чи сервер відхилив саме облікові дані?
    const invalidCredentials =
        error === "Неправильна пошта або пароль";

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
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
        <form
            onSubmit={handleSubmit}
            aria-busy={loading}
        >
            <h2>Вхід в акаунт</h2>

            <div>
                <label htmlFor="login-email">
                    Email
                </label>

                <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                        setError(null);
                    }}
                    autoComplete="username"
                    placeholder="you@example.com"
                    aria-invalid={invalidCredentials}
                    aria-describedby={
                        invalidCredentials
                            ? "login-error"
                            : undefined
                    }
                    disabled={loading}
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
                    onChange={(event) => {
                        setPassword(event.target.value);
                        setError(null);
                    }}
                    autoComplete="current-password"
                    placeholder="Введіть пароль"
                    aria-invalid={invalidCredentials}
                    aria-describedby={
                        invalidCredentials
                            ? "login-error"
                            : undefined
                    }
                    disabled={loading}
                    required
                />
            </div>

            {error && (
                <p id="login-error" role="alert">
                    {error}
                </p>
            )}

            {loading && (
                <p role="status">
                    Перевіряємо облікові дані...
                </p>
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
