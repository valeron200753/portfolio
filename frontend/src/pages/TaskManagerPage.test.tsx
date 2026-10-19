
import {
    cleanup,
    render,
    screen,
    waitFor
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
    afterEach,
    describe,
    expect,
    it,
    vi
} from "vitest";

import type { Task } from "../types/task";

import TaskManagerPage from "./TaskManagerPage";

import {
    getMyTasks,
    createMyTask,
    UnauthorizedError
} from "../api/tasks";

// Імітуємо Backend API
vi.mock("../api/tasks", () => ({
    getMyTasks: vi.fn(),
    createMyTask: vi.fn(),
    updateMyTask: vi.fn(),
    deleteMyTask: vi.fn(),

    UnauthorizedError: class UnauthorizedError
        extends Error { }
}));

// Очищаємо DOM та історію викликів після тесту
afterEach(() => {
    cleanup();
    vi.resetAllMocks();
});

describe("TaskManagerPage", () => {

    // ==============================
    // ТЕСТ 1 — Порожній список
    // ==============================

    it("показує порожній список завдань", async () => {
        vi.mocked(getMyTasks).mockResolvedValue([]);

        render(
            <TaskManagerPage
                onUnauthorized={vi.fn()}
            />
        );

        expect(
            screen.getByRole("heading", {
                name: "My Task Manager"
            })
        ).toBeInTheDocument();

        expect(
            await screen.findByText(
                /Завдань поки немає/
            )
        ).toBeInTheDocument();
    });

    // ==============================
    // ТЕСТ 2 — Створення завдання
    // ==============================

    it("створює нове завдання", async () => {
        vi.mocked(getMyTasks).mockResolvedValue([]);

        const newTask = {
            id: 101,
            title: "Вивчити Vitest",
            completed: false
        } as Task;

        vi.mocked(createMyTask).mockResolvedValue(
            newTask
        );

        const user = userEvent.setup();

        render(
            <TaskManagerPage
                onUnauthorized={vi.fn()}
            />
        );

        // Чекаємо завершення завантаження
        await screen.findByText(
            /Завдань поки немає/
        );

        const input = screen.getByRole("textbox", {
            name: /new task/i
        });

        const button = screen.getByRole("button", {
            name: "Add Task"
        });

        // Імітуємо введення користувача
        await user.type(
            input,
            "  Вивчити Vitest  "
        );

        // Імітуємо натискання кнопки
        await user.click(button);

        // Перевіряємо аргумент і кількість викликів
        expect(createMyTask).toHaveBeenCalledWith(
            "Вивчити Vitest"
        );

        expect(createMyTask).toHaveBeenCalledTimes(1);

        // Перевіряємо результат на екрані
        expect(
            await screen.findByText("Вивчити Vitest")
        ).toBeInTheDocument();

        // Після успіху поле має очиститися
        expect(input).toHaveValue("");
    });

    it("показує помилку та відновлює список після Retry", async () => {
        // Тестове завдання для другої відповіді
        const restoredTask = {
            id: 102,
            title: "Перевірити Retry",
            completed: false
        } as Task;

        // Перший запит завершується помилкою
        // Другий запит повертає список завдань
        vi.mocked(getMyTasks)
            .mockRejectedValueOnce(
                new Error(
                    "Немає зв'язку з сервером. Спробуйте знову."
                )
            )
            .mockResolvedValueOnce([restoredTask]);

        const user = userEvent.setup();

        render(
            <TaskManagerPage
                onUnauthorized={vi.fn()}
            />
        );

        // React повинен показати помилку
        expect(
            await screen.findByText(
                "Немає зв'язку з сервером. Спробуйте знову."
            )
        ).toBeInTheDocument();

        // Знаходимо кнопку повторної спроби
        const retryButton = screen.getByRole("button", {
            name: "Спробувати знову"
        });

        // Імітуємо натискання
        await user.click(retryButton);

        // Завдання повинно з'явитися
        expect(
            await screen.findByText("Перевірити Retry")
        ).toBeInTheDocument();

        // Помилка має зникнути
        expect(
            screen.queryByText(
                "Немає зв'язку з сервером. Спробуйте знову."
            )
        ).not.toBeInTheDocument();

        // API викликали рівно двічі
        expect(getMyTasks).toHaveBeenCalledTimes(2);
    });

    it("повідомляє App про завершення сесії", async () => {
        // Імітуємо недійсну сесію
        vi.mocked(getMyTasks).mockRejectedValueOnce(
            new UnauthorizedError()
        );

        // Створюємо mock для callback
        const onUnauthorized = vi.fn();

        render(
            <TaskManagerPage
                onUnauthorized={onUnauthorized}
            />
        );

        // Чекаємо, поки компонент обробить помилку
        await waitFor(() => {
            expect(onUnauthorized).toHaveBeenCalledTimes(1);
        });

        // Перевіряємо, що API викликали
        expect(getMyTasks).toHaveBeenCalledTimes(1);
    });

    it("не створює дублікати під час повторного натискання", async () => {
        vi.mocked(getMyTasks).mockResolvedValue([]);

        const newTask = {
            id: 103,
            title: "Завдання без дублювання",
            completed: false
        } as Task;

        // Зберігаємо можливість завершити запит вручну
        let resolveRequest!: (task: Task) => void;

        const pendingRequest = new Promise<Task>((resolve) => {
            resolveRequest = resolve;
        });

        // API поки що не повертає результат
        vi.mocked(createMyTask).mockReturnValueOnce(
            pendingRequest
        );

        const user = userEvent.setup();

        render(
            <TaskManagerPage onUnauthorized={vi.fn()} />
        );

        await screen.findByText(/Завдань поки немає/);

        const input = screen.getByRole("textbox", {
            name: /new task/i
        });

        const button = screen.getByRole("button", {
            name: "Add Task"
        });

        await user.type(
            input,
            "Завдання без дублювання"
        );

        // Перше натискання
        await user.click(button);

        expect(createMyTask).toHaveBeenCalledTimes(1);

        // Поки відповідь не отримана, кнопка заблокована
        expect(button).toBeDisabled();

        // Пробуємо натиснути повторно
        await user.click(button);

        // Другого запиту не повинно бути
        expect(createMyTask).toHaveBeenCalledTimes(1);

        // Тепер імітуємо успішну відповідь сервера
        resolveRequest(newTask);

        expect(
            await screen.findByText("Завдання без дублювання")
        ).toBeInTheDocument();

        // Після створення поле очищається
        expect(input).toHaveValue("");

        // Кнопка заблокована, бо назва порожня
        expect(button).toBeDisabled();

        // Користувач вводить наступне завдання
        await user.type(input, "Наступне завдання");

        // Тепер кнопку можна натиснути знову
        expect(button).toBeEnabled();

        // Попереднє створення викликало API лише один раз
        expect(createMyTask).toHaveBeenCalledTimes(1);

    });




});
