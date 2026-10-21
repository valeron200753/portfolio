
import type { Task } from "../types/task";

// ==============================
// СПЕЦІАЛЬНІ ТИПИ ПОМИЛОК
// ==============================

export class UnauthorizedError extends Error {
    constructor() {
        super("Сесія завершилася. Увійдіть повторно.");
        this.name = "UnauthorizedError";
    }
}


export class ApiError extends Error {
    readonly status: number;

    constructor(status: number, message: string) {
        super(message);

        this.name = "ApiError";
        this.status = status;
    }
}


// ==============================
// ПОВІДОМЛЕННЯ ДЛЯ КОРИСТУВАЧА
// ==============================

const errorMessages: Record<string, string> = {
    "Invalid task title":
        "Введіть коректну назву завдання.",

    "Invalid task ID":
        "Некоректний ID завдання.",

    "Task not found":
        "Завдання не знайдено або воно вам недоступне.",

    "Completed must be a boolean":
        "Некоректний статус завдання.",

    "Forbidden origin":
        "Запит заблоковано перевіркою безпеки."
};

function getFallbackMessage(status: number): string {
    if (status === 400) {
        return "Перевірте правильність введених даних.";
    }

    if (status === 403) {
        return "Недостатньо прав для виконання запиту.";
    }

    if (status === 404) {
        return "Запитаний ресурс не знайдено.";
    }

    if (status >= 500) {
        return "Помилка сервера. Спробуйте пізніше.";
    }

    return `Не вдалося виконати запит (HTTP ${status}).`;
}

// ==============================
// СПІЛЬНА ФУНКЦІЯ HTTP-ЗАПИТІВ
// ==============================

async function requestJson<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    let response: Response;

    try {
        response = await fetch(path, {
            ...options,
            credentials: "include"
        });
    } catch (error) {
        // Не перетворюємо скасований запит на мережеву помилку
        if (
            error instanceof Error &&
            error.name === "AbortError"
        ) {
            throw error;
        }

        throw new Error(
    "Немає зв'язку з сервером. Спробуйте знову.",
    { cause: error }
);
    }

    // Сесія відсутня або недійсна
    if (response.status === 401) {
        throw new UnauthorizedError();
    }

    // Обробляємо інші HTTP-помилки
    if (!response.ok) {
        let backendMessage: string | null = null;

        try {
            const data: unknown = await response.json();

            if (
                data !== null &&
                typeof data === "object" &&
                "error" in data &&
                typeof data.error === "string"
            ) {
                backendMessage = data.error;
            }
        } catch {
            // Відповідь могла бути не у форматі JSON
        }

        const message = backendMessage
            ? errorMessages[backendMessage]
            : undefined;

        throw new ApiError(
            response.status,
            message ?? getFallbackMessage(response.status)
        );
    }

    return (await response.json()) as T;
}

// ==============================
// GET — ОТРИМАТИ ЗАВДАННЯ
// ==============================

export async function getMyTasks(
    signal?: AbortSignal
): Promise<Task[]> {
    return requestJson<Task[]>("/api/tasks", {
        method: "GET",
        signal
    });
}

// ==============================
// POST — СТВОРИТИ ЗАВДАННЯ
// ==============================

export async function createMyTask(
    title: string
): Promise<Task> {
    return requestJson<Task>("/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
    });
}

// ==============================
// PATCH — ОНОВИТИ ЗАВДАННЯ
// ==============================

export async function updateMyTask(
    id: number,
    completed: boolean
): Promise<Task> {
    return requestJson<Task>(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ completed })
    });
}

// ==============================
// DELETE — ВИДАЛИТИ ЗАВДАННЯ
// ==============================

export async function deleteMyTask(
    id: number
): Promise<void> {
    await requestJson<Task>(`/api/tasks/${id}`, {
        method: "DELETE"
    });
}
