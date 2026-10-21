
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
    const [error, setError] =
        useState<string | null>(null);

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
            className="auth-form"
            onSubmit={handleSubmit}
            aria-busy={loading}
        >
            <div className="auth-card__heading">
                <span className="auth-eyebrow">
                    ACCOUNT ACCESS
                </span>

                <h2>
                    Welcome back<span>.</span>
                </h2>

                <p>
                    Увійдіть, щоб продовжити роботу
                    зі своїми завданнями.
                </p>
            </div>

            <div className="auth-form__field">
                <label htmlFor="login-email">
                    Email address
                </label>

                <input
                    id="login-email"
                    type="email"
                    value={email}
                    autoComplete="username"
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                    aria-invalid={invalidCredentials}
                    aria-describedby={
                        invalidCredentials
                            ? "login-error"
                            : undefined
                    }
                    onChange={(event) => {
                        setEmail(event.target.value);
                        setError(null);
                    }}
                />
            </div>

            <div className="auth-form__field">
                <label htmlFor="login-password">
                    Password
                </label>

                <input
                    id="login-password"
                    type="password"
                    value={password}
                    autoComplete="current-password"
                    placeholder="Введіть пароль"
                    required
                    disabled={loading}
                    aria-invalid={invalidCredentials}
                    aria-describedby={
                        invalidCredentials
                            ? "login-error"
                            : undefined
                    }
                    onChange={(event) => {
                        setPassword(event.target.value);
                        setError(null);
                    }}
                />
            </div>

            {error && (
                <div
                    id="login-error"
                    className="auth-feedback auth-feedback--error"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {loading && (
                <p
                    className="auth-form__loading"
                    role="status"
                >
                    Перевіряємо облікові дані...
                </p>
            )}

            <button
                type="submit"
                className="auth-button auth-button--primary"
                disabled={loading}
            >
                {loading ? "Входимо..." : "Увійти"}
                <span aria-hidden="true">→</span>
            </button>
        </form>
    );
}

export default LoginForm;
