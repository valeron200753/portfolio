
import { useState } from "react";
import { Link } from "react-router-dom";

import {
    logoutUser,
    type AuthUser
} from "../api/auth";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

import "../styles/auth.css";

type AuthStatusProps = {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
    onUserChange: (user: AuthUser | null) => void;
    onRetry: () => void;
};

function AuthStatus({
    user,
    loading,
    error,
    onUserChange,
    onRetry
}: AuthStatusProps) {
    const [showRegister, setShowRegister] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);
    const [loggingOut, setLoggingOut] = useState(false);
    const [logoutError, setLogoutError] =
        useState<string | null>(null);

    function handleRegistered() {
        setShowRegister(false);
        setNotice("Акаунт створено! Тепер увійдіть.");
    }

    function handleLoginSuccess(currentUser: AuthUser) {
        onUserChange(currentUser);
        setNotice(null);
        setLogoutError(null);
    }

    async function handleLogout() {
        if (loggingOut) return;

        setLoggingOut(true);
        setLogoutError(null);

        try {
            await logoutUser();

            onUserChange(null);
            setShowRegister(false);
            setNotice("Ви успішно вийшли з акаунту.");
        } catch {
            setLogoutError(
                "Не вдалося вийти. Спробуйте ще раз."
            );
        } finally {
            setLoggingOut(false);
        }
    }

    return (
        <section
            className="auth-shell"
            aria-label="Особистий кабінет"
        >
            {/* LEFT PANEL */}

            <aside className="auth-shell__aside">
                <div className="auth-shell__brand">
                    T.
                </div>

                <div className="auth-shell__aside-content">
                    <span className="auth-eyebrow">
                        PRIVATE WORKSPACE
                    </span>

                    <h1>
                        Stay focused.
                        <span> Build more.</span>
                    </h1>

                    <p>
                        Your personal space for organizing
                        tasks, tracking progress and
                        building productive habits.
                    </p>

                    <div className="auth-shell__features">
                        <div>
                            <span aria-hidden="true">✓</span>
                            Personal task management
                        </div>

                        <div>
                            <span aria-hidden="true">✓</span>
                            Account-based access
                        </div>

                        <div>
                            <span aria-hidden="true">✓</span>
                            Your tasks, your workspace
                        </div>
                    </div>
                </div>

                <div className="auth-shell__aside-footer">
                    <span
                        className="auth-shell__status-dot"
                        aria-hidden="true"
                    />
                    Built with React, Express and SQLite
                </div>
            </aside>

            {/* RIGHT PANEL */}

            <div className="auth-shell__body">
                {loading ? (
                    <div className="auth-card auth-card--centered">
                        <span className="auth-eyebrow">
                            PLEASE WAIT
                        </span>

                        <h2>Checking your session...</h2>

                        <p role="status">
                            Перевіряємо авторизацію...
                        </p>
                    </div>
                ) : error ? (
                    <div className="auth-card">
                        <span className="auth-eyebrow">
                            CONNECTION ERROR
                        </span>

                        <h2>
                            Connection problem<span>.</span>
                        </h2>

                        <p className="auth-card__description">
                            Не вдалося перевірити сесію.
                            Це може бути тимчасова проблема.
                        </p>

                        <div
                            className="auth-feedback auth-feedback--error"
                            role="alert"
                        >
                            {error}
                        </div>

                        <button
                            type="button"
                            className="auth-button auth-button--primary"
                            onClick={onRetry}
                        >
                            Спробувати знову
                            <span aria-hidden="true">↻</span>
                        </button>
                    </div>
                ) : !user ? (
                    <div className="auth-card">
                        {notice && (
                            <div
                                className="auth-feedback auth-feedback--success"
                                role="status"
                            >
                                {notice}
                            </div>
                        )}

                        {showRegister ? (
                            <RegisterForm
                                onRegistered={handleRegistered}
                            />
                        ) : (
                            <LoginForm
                                onSuccess={handleLoginSuccess}
                            />
                        )}

                        <div className="auth-switch">
                            <p>
                                {showRegister
                                    ? "Вже маєте акаунт?"
                                    : "Ще немає акаунту?"}
                            </p>

                            <button
                                type="button"
                                className="auth-switch__button"
                                onClick={() => {
                                    setNotice(null);
                                    setShowRegister(
                                        (current) => !current
                                    );
                                }}
                            >
                                {showRegister
                                    ? "Увійти"
                                    : "Створити акаунт"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="auth-card">
                        <span className="auth-eyebrow">
                            YOUR ACCOUNT
                        </span>

                        <div className="auth-profile__avatar">
                            <span aria-hidden="true">@</span>
                        </div>

                        <h2>
                            Welcome back<span>.</span>
                        </h2>

                        <p className="auth-card__description">
                            Ви успішно авторизовані.
                            Ваш робочий простір готовий.
                        </p>

                        <div className="auth-profile__identity">
                            <span>ACCOUNT EMAIL</span>
                            <strong>{user.email}</strong>
                        </div>

                        <Link
                            to="/tasks"
                            className="auth-button auth-button--primary"
                        >
                            Open Task Manager
                            <span aria-hidden="true">↗</span>
                        </Link>

                        {logoutError && (
                            <div
                                className="auth-feedback auth-feedback--error"
                                role="alert"
                            >
                                {logoutError}
                            </div>
                        )}

                        <button
                            type="button"
                            className="auth-button auth-button--secondary"
                            onClick={() => void handleLogout()}
                            disabled={loggingOut}
                        >
                            {loggingOut
                                ? "Виходимо..."
                                : "Вийти з акаунту"}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

export default AuthStatus;
