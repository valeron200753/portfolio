
import {
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";

import {
    Routes,
    Route,
    Link
} from "react-router-dom";

import ThemeContext from "./context/ThemeContext";

import {
    getCurrentUser,
    type AuthUser
} from "./api/auth";

import Header from "./components/Header";
import AuthStatus from "./components/AuthStatus";

import Home from "./pages/Home";
import ProjectsPage from "./pages/ProjectsPage";
import ContactPage from "./pages/ContactPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import NotFound from "./pages/NotFound";
import TaskManagerPage from "./pages/TaskManagerPage";

function App() {
    const { theme } = useContext(ThemeContext);

    // ==============================
    // AUTH STATE
    // ==============================

    const [user, setUser] = useState<AuthUser | null>(null);

    const [authLoading, setAuthLoading] = useState(true);

    const [authError, setAuthError] =
        useState<string | null>(null);

    const [authRetryCount, setAuthRetryCount] = useState(0);

    // ==============================
    // CHECK SESSION
    // ==============================

    useEffect(() => {
        let ignore = false;

        async function checkSession() {
            try {
                const currentUser = await getCurrentUser();

                if (ignore) return;

                setUser(currentUser);
                setAuthError(null);
            } catch (error) {
                if (ignore) return;

                setUser(null);

                setAuthError(
                    error instanceof Error
                        ? error.message
                        : "Не вдалося перевірити сесію."
                );
            } finally {
                if (!ignore) {
                    setAuthLoading(false);
                }
            }
        }

        void checkSession();

        return () => {
            ignore = true;
        };
    }, [authRetryCount]);

    // ==============================
    // AUTH HANDLERS
    // ==============================

    function handleUserChange(nextUser: AuthUser | null) {
        setUser(nextUser);
        setAuthError(null);
    }

    function handleRetryAuth() {
        setAuthLoading(true);
        setAuthError(null);

        setAuthRetryCount((current) => current + 1);
    }

    const handleUnauthorized = useCallback(() => {
        setUser(null);
        setAuthError(null);
    }, []);

    // ==============================
    // TASK MANAGER ACCESS
    // ==============================

    const tasksElement = authLoading ? (
        <main>
            <p role="status">
                Перевіряємо авторизацію...
            </p>
        </main>
    ) : authError ? (
        <main>
            <h1>Task Manager</h1>

            <p>
                Завдання недоступні, поки ми не
                перевіримо сесію.
            </p>

            <Link to="/account">
                Перейти до перевірки акаунту →
            </Link>
        </main>
    ) : user ? (
        <TaskManagerPage
            key={user.id}
            onUnauthorized={handleUnauthorized}
        />
    ) : (
        <main>
            <h1>Task Manager</h1>

            <p>
                Увійдіть в акаунт, щоб працювати
                зі своїми завданнями.
            </p>

            <Link to="/account">
                Увійти в акаунт →
            </Link>
        </main>
    );

    // ==============================
    // APPLICATION ROUTES
    // ==============================

    return (
        <div className={theme}>
            <Header />

            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/projects"
                    element={<ProjectsPage />}
                />

                <Route
                    path="/projects/:id"
                    element={<ProjectDetailsPage />}
                />

                <Route
                    path="/contact"
                    element={<ContactPage />}
                />

                <Route
                    path="/tasks"
                    element={tasksElement}
                />

                <Route
                    path="/account"
                    element={
                        <main className="account-page">
                            <AuthStatus
                                user={user}
                                loading={authLoading}
                                error={authError}
                                onUserChange={handleUserChange}
                                onRetry={handleRetryAuth}
                            />
                        </main>
                    }
                />

                <Route
                    path="*"
                    element={<NotFound />}
                />
            </Routes>
        </div>
    );
}

export default App;
