
import {
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";
import { Routes, Route } from "react-router-dom";

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

    const [user, setUser] = useState<AuthUser | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    const [authRetryCount, setAuthRetryCount] = useState(0);


    useEffect(() => {
        let ignore = false;

        setAuthLoading(true);
        setAuthError(null);

        async function checkSession() {
            try {
                const currentUser = await getCurrentUser();

                if (!ignore) {
                    setUser(currentUser);
                }
            } catch {
                if (!ignore) {
                    setAuthError(
                        "Не вдалося перевірити сесію"
                    );
                }
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


    function handleUserChange(nextUser: AuthUser | null) {
        setUser(nextUser);
        setAuthError(null);
    }

    function handleRetryAuth() {
        setAuthRetryCount((current) => current + 1);
    }

    const handleUnauthorized = useCallback(() => {
        setUser(null);
        setAuthError(null);
    }, []);

    const tasksElement = authLoading ? (
        <main>
            <p>Перевіряємо авторизацію...</p>
        </main>
    ) : authError ? (
        <main>
            <p>
                Завдання недоступні, поки ми не перевіримо сесію.
            </p>
        </main>
    ) : user ? (
        <TaskManagerPage
            key={user.id}
            onUnauthorized={handleUnauthorized}
        />
    ) : (
        <main>
            <h1>Task Manager</h1>
            <p>Увійдіть в акаунт, щоб працювати із завданнями.</p>
        </main>
    );

    return (
        <div className={theme}>
            <Header />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route
                    path="/projects/:id"
                    element={<ProjectDetailsPage />}
                />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/tasks" element={tasksElement} />
                <Route path="*" element={<NotFound />} />
            </Routes>

            <AuthStatus
                user={user}
                loading={authLoading}
                error={authError}
                onUserChange={handleUserChange}
                onRetry={handleRetryAuth}
            />
        </div>
    );
}

export default App;
