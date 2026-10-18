
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

    useEffect(() => {
        let ignore = false;

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
    }, []);

    function handleUserChange(nextUser: AuthUser | null) {
        setUser(nextUser);
        setAuthError(null);
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
            <p role="alert">{authError}</p>
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
            />
        </div>
    );
}

export default App;
