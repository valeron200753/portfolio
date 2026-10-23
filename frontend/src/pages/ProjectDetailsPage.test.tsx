
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import {
    MemoryRouter,
    Routes,
    Route
} from "react-router-dom";

import ProjectDetailsPage from "./ProjectDetailsPage";

// Render a project using its actual route
function renderProject(projectId: number) {
    render(
        <MemoryRouter
            initialEntries={[`/projects/${projectId}`]}
        >
            <Routes>
                <Route
                    path="/projects/:id"
                    element={<ProjectDetailsPage />}
                />
            </Routes>
        </MemoryRouter>
    );
}

describe("ProjectDetailsPage", () => {
    it("shows the correct Portfolio repository", () => {
        renderProject(1);

        const link = screen.getByRole("link", {
            name: /view source on github/i
        });

        expect(link.getAttribute("href")).toBe(
            "https://github.com/valeron200753/portfolio"
        );

        expect(link.getAttribute("target")).toBe("_blank");
        expect(link.getAttribute("rel")).toContain("noopener");
        expect(link.getAttribute("rel")).toContain("noreferrer");
    });

    it("shows the correct Task Manager repository", () => {
        renderProject(2);

        const link = screen.getByRole("link", {
            name: /view source on github/i
        });

        expect(link.getAttribute("href")).toBe(
            "https://github.com/valeron200753/task-manager"
        );
    });

    it("does not show a repository link for Weather App", () => {
        renderProject(3);

        const link = screen.queryByRole("link", {
            name: /view source on github/i
        });

        expect(link).toBeNull();
    });
});
