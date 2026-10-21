
import { useState, type FormEvent } from "react";

import { registerUser } from "../api/auth";

type RegisterFormProps = {
    onRegistered: () => void;
};

function RegisterForm({
    onRegistered
}: RegisterFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] =
        useState<string | null>(null);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            await registerUser(email, password);

            setPassword("");
            onRegistered();
        } catch (err) {
            const message = err instanceof Error
                ? err.message
                : "Не вдалося зареєструватися";

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
                    NEW ACCOUNT
                </span>

                <h2>
                    Create account<span>.</span>
                </h2>

                <p>
                    Зареєструйтеся, щоб отримати
                    власний простір для завдань.
                </p>
            </div>

            <div className="auth-form__field">
                <label htmlFor="register-email">
                    Email address
                </label>

                <input
                    id="register-email"
                    type="email"
                    value={email}
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                    onChange={(event) => {
                        setEmail(event.target.value);
                        setError(null);
                    }}
                />
            </div>

            <div className="auth-form__field">
                <label htmlFor="register-password">
                    Password
                </label>

                <input
                    id="register-password"
                    type="password"
                    value={password}
                    minLength={15}
                    maxLength={128}
                    autoComplete="new-password"
                    placeholder="Створіть пароль"
                    aria-describedby="register-password-hint"
                    required
                    disabled={loading}
                    onChange={(event) => {
                        setPassword(event.target.value);
                        setError(null);
                    }}
                />

                <p
                    id="register-password-hint"
                    className="auth-form__hint"
                >
                    Використовуйте пароль від 15 до 128 символів.
                </p>
            </div>

            {error && (
                <div
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
                    Створюємо акаунт...
                </p>
            )}

            <button
                type="submit"
                className="auth-button auth-button--primary"
                disabled={loading}
            >
                {loading
                    ? "Реєструємо..."
                    : "Зареєструватися"}

                <span aria-hidden="true">→</span>
            </button>
        </form>
    );
}

export default RegisterForm;
