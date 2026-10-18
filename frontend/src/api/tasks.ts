
import type { Task } from "../types/task";

export class UnauthorizedError extends Error {
    constructor() {
        super("Сесія завершилася. Увійдіть повторно.");
        this.name = "UnauthorizedError";
    }
}

async function requestJson<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(path, {
        credentials: "include",
        ...options
    });

    if (response.status === 401) {
        throw new UnauthorizedError();
    }

    if (!response.ok) {
        throw new Error(
            `Помилка HTTP ${response.status}`
        );
    }

    return (await response.json()) as T;
}

export async function getMyTasks(
    signal?: AbortSignal
): Promise<Task[]> {
    return requestJson<Task[]>("/api/tasks", {
        method: "GET",
        signal
    });
}

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

export async function deleteMyTask(
    id: number
): Promise<void> {
    await requestJson<Task>(`/api/tasks/${id}`, {
        method: "DELETE"
    });
}
