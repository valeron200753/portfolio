
import { useState, type FormEvent } from "react";

import { registerUser } from "../api/auth";

type RegisterFormProps = {
    onRegistered: () => void;
};

function RegisterForm({ onRegistered }: RegisterFormProps) {
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
        <form onSubmit={handleSubmit}>
            <h2>Створити акаунт</h2>

            <div>
                <label htmlFor="register-email">
                    Email
                </label>

                <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                />
            </div>

            <div>
                <label htmlFor="register-password">
                    Пароль
                </label>

                <input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                    minLength={15}
                    maxLength={128}
                    autoComplete="new-password"
                    required
                />
                <p>Від 15 до 128 символів.</p>
            </div>

            {error && (
                <p role="alert">{error}</p>
            )}

            <button
                type="submit"
                disabled={loading}
            >
                {loading
                    ? "Реєструємо..."
                    : "Зареєструватися"}
            </button>
        </form>
    );
}

export default RegisterForm;
