
import { describe, expect, it } from "vitest";
import { projects } from "./projects";

describe("Portfolio projects", () => {
    it("keeps Portfolio in progress", () => {
        const portfolio = projects.find(
            (project) => project.title === "Portfolio"
        );

        expect(portfolio?.status).toBe("in-progress");
    });

    it("marks Task Manager as completed", () => {
        const taskManager = projects.find(
            (project) => project.title === "Task Manager"
        );

        expect(taskManager?.status).toBe("completed");
    });

    it("marks Weather App as planned", () => {
        const weatherApp = projects.find(
            (project) => project.title === "Weather App"
        );

        expect(weatherApp?.status).toBe("planned");
    });

    it("does not link to removed task routes", () => {
        const hasOldTaskDemo = projects.some(
            (project) => project.demoPath === "/tasks"
        );

        expect(hasOldTaskDemo).toBe(false);
    });
});
