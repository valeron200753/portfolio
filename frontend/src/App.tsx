import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProjectsPage from "./pages/ProjectsPage";
import ContactPage from "./pages/ContactPage";
import Header from "./components/Header";
import NotFound from "./pages/NotFound";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";

function App() {
    return (
        <>
            <Header />

           <Routes>
    <Route path="/" element={<Home />} />

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
        path="*"
        element={<NotFound />}
    />
</Routes>
        </>
    );
}

export default App;