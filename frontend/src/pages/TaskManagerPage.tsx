
import {
    useEffect,
    useState,
    type FormEvent
} from "react";

import type { Task } from "../types/task";

import {
    getMyTasks,
    createMyTask,
    updateMyTask,
    deleteMyTask,
    UnauthorizedError
} from "../api/tasks";

type TaskManagerPageProps = {
    onUnauthorized: () => void;
};

function TaskManagerPage({
    onUnauthorized
}: TaskManagerPageProps) {
    const [tasks, setTasks] = useState<Task[]>([]);

    const [newTaskTitle, setNewTaskTitle] = useState("");

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [actionError, setActionError] = useState<string | null>(null);

    const [adding, setAdding] = useState(false);
    const [busyTaskId, setBusyTaskId] = useState<number | null>(null);

    // ==============================
    // Завантаження завдань
    // ==============================

    useEffect(() => {
        const controller = new AbortController();

        async function loadTasks() {
            setLoading(true);
            setLoadError(null);

            try {
                const data = await getMyTasks(
                    controller.signal
                );

                if (!controller.signal.aborted) {
                    setTasks(data);
                }
            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }

                if (error instanceof UnauthorizedError) {
                    onUnauthorized();
                    return;
                }

                setTasks([]);
                setLoadError(
                    "Не вдалося завантажити завдання."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        void loadTasks();

        return () => {
            controller.abort();
        };
    }, [onUnauthorized]);

    // ==============================
    // Обробка помилок дій
    // ==============================

    function handleActionError(
        error: unknown,
        action: string
    ) {
        if (error instanceof UnauthorizedError) {
            onUnauthorized();
            return;
        }

        const message = error instanceof Error
            ? error.message
            : "Невідома помилка";

        setActionError(`${action}: ${message}`);
    }

    // ==============================
    // Створення завдання
    // ==============================

    async function handleAddTask(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const title = newTaskTitle.trim();

        if (
            title === "" ||
            adding ||
            loading ||
            loadError !== null
        ) {
            return;
        }

        setAdding(true);
        setActionError(null);

        try {
            const newTask = await createMyTask(title);

            setTasks((currentTasks) => [
                newTask,
                ...currentTasks
            ]);

            setNewTaskTitle("");
        } catch (error) {
            handleActionError(
                error,
                "Не вдалося створити завдання"
            );
        } finally {
            setAdding(false);
        }
    }

    // ==============================
    // Зміна статусу завдання
    // ==============================

    async function toggleTask(id: number) {
        if (busyTaskId !== null) {
            return;
        }

        const task = tasks.find(
            (item) => item.id === id
        );

        if (!task) {
            return;
        }

        setBusyTaskId(id);
        setActionError(null);

        try {
            const updatedTask = await updateMyTask(
                id,
                !task.completed
            );

            setTasks((currentTasks) =>
                currentTasks.map((item) =>
                    item.id === id
                        ? updatedTask
                        : item
                )
            );
        } catch (error) {
            handleActionError(
                error,
                "Не вдалося оновити завдання"
            );
        } finally {
            setBusyTaskId(null);
        }
    }

    // ==============================
    // Видалення завдання
    // ==============================

    async function handleDeleteTask(id: number) {
        if (busyTaskId !== null) {
            return;
        }

        setBusyTaskId(id);
        setActionError(null);

        try {
            await deleteMyTask(id);

            setTasks((currentTasks) =>
                currentTasks.filter(
                    (task) => task.id !== id
                )
            );
        } catch (error) {
            handleActionError(
                error,
                "Не вдалося видалити завдання"
            );
        } finally {
            setBusyTaskId(null);
        }
    }

    // ==============================
    // Статистика
    // ==============================

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        (task) => task.completed
    ).length;

    const remainingTasks =
        totalTasks - completedTasks;

    // ==============================
    // JSX
    // ==============================

    return (
        <main>
            <h1>My Task Manager</h1>

            <p>
                Тут відображаються тільки ваші завдання.
            </p>

            <form onSubmit={handleAddTask}>
                <label htmlFor="new-task-title">
                    New task
                </label>

                <input
                    id="new-task-title"
                    type="text"
                    placeholder="Enter a new task..."
                    value={newTaskTitle}
                    onChange={(event) =>
                        setNewTaskTitle(event.target.value)
                    }
                    required
                    disabled={loading || adding || loadError !== null}
                />

                <button
                    type="submit"
                    disabled={
                        loading ||
                        adding ||
                        loadError !== null ||
                        !newTaskTitle.trim()
                    }
                >
                    {adding ? "Adding..." : "Add Task"}
                </button>
            </form>

            {actionError && (
                <p role="alert">{actionError}</p>
            )}

            {loading && (
                <p role="status">
                    Завантажуємо завдання...
                </p>
            )}

            {loadError && (
                <p role="alert">{loadError}</p>
            )}

            {!loading && !loadError && (
                <>
                    <section>
                        <h2>Task Statistics</h2>

                        <p>Total tasks: {totalTasks}</p>
                        <p>Completed: {completedTasks}</p>
                        <p>Remaining: {remainingTasks}</p>
                    </section>

                    {tasks.length === 0 ? (
                        <p>
                            Завдань поки немає.
                            Створіть своє перше!
                        </p>
                    ) : (
                        <ul>
                            {tasks.map((task) => (
                                <li key={task.id}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            disabled={busyTaskId !== null}
                                            onChange={() => {
                                                void toggleTask(task.id);
                                            }}
                                        />

                                        {task.title}
                                    </label>

                                    <span>
                                        {" — "}
                                        {task.completed
                                            ? "Completed"
                                            : "In progress"}
                                    </span>

                                    <button
                                        type="button"
                                        disabled={busyTaskId !== null}
                                        onClick={() => {
                                            void handleDeleteTask(task.id);
                                        }}
                                    >
                                        {busyTaskId === task.id
                                            ? "Processing..."
                                            : "Delete"}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </main>
    );
}

export default TaskManagerPage;
