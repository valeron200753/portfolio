
import { useState } from "react";

import {
    logoutUser,
    type AuthUser
} from "../api/auth";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

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
}: AuthStatusProps) 
    {
        const [showRegister, setShowRegister] = useState(false);
        const [notice, setNotice] = useState<string | null>(null);
        const [loggingOut, setLoggingOut] = useState(false);
        const [logoutError, setLogoutError] = useState<string | null>(null);

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

        if (loading) {
            return <p>Перевіряємо сесію...</p>;
        }

        if (error) {
            return (
                <section>
                    <p role="alert">{error}</p>

                    <button
                        type="button"
                        onClick={onRetry}
                    >
                        Спробувати знову
                    </button>
                </section>
            );
        }

        if (!user) {
            return (
                <section>
                    {notice && <p role="status">{notice}</p>}

                    {showRegister ? (
                        <>
                            <RegisterForm
                                onRegistered={handleRegistered}
                            />

                            <p>Вже маєте акаунт?</p>

                            <button
                                type="button"
                                onClick={() => setShowRegister(false)}
                            >
                                Увійти
                            </button>
                        </>
                    ) : (
                        <>
                            <LoginForm
                                onSuccess={handleLoginSuccess}
                            />

                            <p>Ще немає акаунту?</p>

                            <button
                                type="button"
                                onClick={() => {
                                    setNotice(null);
                                    setShowRegister(true);
                                }}
                            >
                                Зареєструватися
                            </button>
                        </>
                    )}
                </section>
            );
        }

        return (
            <section>
                <h2>Особистий кабінет</h2>

                <p>
                    Ви увійшли як: <strong>{user.email}</strong>
                </p>

                {logoutError && (
                    <p role="alert">{logoutError}</p>
                )}

                <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                >
                    {loggingOut ? "Виходимо..." : "Вийти"}
                </button>
            </section>
        );
    }

    export default AuthStatus;
