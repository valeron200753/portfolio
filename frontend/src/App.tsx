import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import ThemeContext from "./context/ThemeContext";

import Header from "./components/Header";
import Home from "./pages/Home";
import ProjectsPage from "./pages/ProjectsPage";
import ContactPage from "./pages/ContactPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import NotFound from "./pages/NotFound";
import TaskManagerPage from "./pages/TaskManagerPage";

function App() {
    const { theme } = useContext(ThemeContext);

    return (
        <div className={theme}>
            <Header />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectDetailsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route
                    path="/tasks"
                    element={<TaskManagerPage />}
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;