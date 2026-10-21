
import {
    useEffect,
    useRef,
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

import "./TaskManagerPage.css";

type TaskManagerPageProps = {
    onUnauthorized: () => void;
};

type TaskAction = "toggle" | "delete";
type TaskFilter = "all" | "active" | "completed";

function TaskManagerPage({
    onUnauthorized
}: TaskManagerPageProps) {
    const [tasks, setTasks] = useState<Task[]>([]);

    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [retryCount, setRetryCount] = useState(0);

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] =
        useState<string | null>(null);

    const [actionError, setActionError] =
        useState<string | null>(null);

    const [adding, setAdding] = useState(false);

    const [busyTaskId, setBusyTaskId] =
        useState<number | null>(null);

    const [busyTaskAction, setBusyTaskAction] =
        useState<TaskAction | null>(null);

    const [filter, setFilter] =
        useState<TaskFilter>("all");

    const [search, setSearch] = useState("");

    const addRequestInFlight = useRef(false);
    const taskRequestInFlight = useRef(false);

    // ==================================
    // LOAD TASKS
    // ==================================

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
                    error instanceof Error
                        ? error.message
                        : "Не вдалося завантажити завдання."
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
    }, [onUnauthorized, retryCount]);

    // ==================================
    // ACTION ERRORS
    // ==================================

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

    // ==================================
    // CREATE TASK
    // ==================================

    async function handleAddTask(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const title = newTaskTitle.trim();

        if (
            title === "" ||
            addRequestInFlight.current ||
            adding ||
            loading ||
            loadError !== null
        ) {
            return;
        }

        addRequestInFlight.current = true;

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
            addRequestInFlight.current = false;
            setAdding(false);
        }
    }

    // ==================================
    // UPDATE TASK
    // ==================================

    async function toggleTask(id: number) {
        if (
            taskRequestInFlight.current ||
            busyTaskId !== null
        ) {
            return;
        }

        const task = tasks.find(
            (item) => item.id === id
        );

        if (!task) {
            return;
        }

        taskRequestInFlight.current = true;

        setBusyTaskId(id);
        setBusyTaskAction("toggle");
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
            taskRequestInFlight.current = false;
            setBusyTaskId(null);
            setBusyTaskAction(null);
        }
    }

    // ==================================
    // DELETE TASK
    // ==================================

    async function handleDeleteTask(id: number) {
        if (
            taskRequestInFlight.current ||
            busyTaskId !== null
        ) {
            return;
        }

        taskRequestInFlight.current = true;

        setBusyTaskId(id);
        setBusyTaskAction("delete");
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
            taskRequestInFlight.current = false;
            setBusyTaskId(null);
            setBusyTaskAction(null);
        }
    }

    // ==================================
    // STATISTICS
    // ==================================

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        (task) => task.completed
    ).length;

    const remainingTasks =
        totalTasks - completedTasks;

    const completionPercent = totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks / totalTasks) * 100
        );

    // ==================================
    // CLIENT-SIDE FILTERING
    // ==================================

    const visibleTasks = tasks.filter((task) => {
        const matchesSearch = task.title
            .toLowerCase()
            .includes(search.trim().toLowerCase());

        const matchesStatus =
            filter === "all" ||
            (filter === "active" && !task.completed) ||
            (filter === "completed" && task.completed);

        return matchesSearch && matchesStatus;
    });

    return (
        <main className="task-page">
            {/* PAGE HEADER */}

            <header className="task-page__header">
                <div>
                    <span className="task-page__eyebrow">
                        PERSONAL WORKSPACE / TASKS
                    </span>

                    <h1>
                        My Task Manager
                        <span aria-hidden="true">.</span>
                    </h1>

                    <p>
                        Тут відображаються тільки ваші завдання.
                        Плануйте роботу та відстежуйте прогрес.
                    </p>
                </div>

                <div className="task-page__header-icon" aria-hidden="true">
                    ✓
                </div>
            </header>

            {/* STATISTICS */}

            {!loading && !loadError && (
                <section
                    className="task-overview"
                    aria-labelledby="task-stats-title"
                >
                    <div className="task-section-heading">
                        <span className="task-page__eyebrow">
                            01 / OVERVIEW
                        </span>

                        <h2 id="task-stats-title">
                            Task Statistics
                        </h2>
                    </div>

                    <div className="task-overview__grid">
                        <article className="task-stat-card">
                            <span className="task-stat-card__icon" aria-hidden="true">
                                ◈
                            </span>

                            <strong className="task-stat-card__value">
                                {String(totalTasks).padStart(2, "0")}
                            </strong>

                            <p>Total tasks: {totalTasks}</p>
                        </article>

                        <article className="task-stat-card">
                            <span className="task-stat-card__icon" aria-hidden="true">
                                ✓
                            </span>

                            <strong className="task-stat-card__value">
                                {String(completedTasks).padStart(2, "0")}
                            </strong>

                            <p>Completed: {completedTasks}</p>
                        </article>

                        <article className="task-stat-card">
                            <span className="task-stat-card__icon" aria-hidden="true">
                                ◷
                            </span>

                            <strong className="task-stat-card__value">
                                {String(remainingTasks).padStart(2, "0")}
                            </strong>

                            <p>Remaining: {remainingTasks}</p>
                        </article>
                    </div>

                    <div className="task-progress">
                        <div className="task-progress__heading">
                            <span>Overall progress</span>
                            <strong>{completionPercent}%</strong>
                        </div>

                        <div
                            className="task-progress__track"
                            role="progressbar"
                            aria-label="Task completion progress"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={completionPercent}
                        >
                            <div
                                className="task-progress__fill"
                                style={{
                                    width: `${completionPercent}%`
                                }}
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* CREATE TASK */}

            <section
                className="task-create"
                aria-labelledby="task-create-title"
            >
                <div className="task-section-heading">
                    <span className="task-page__eyebrow">
                        02 / CREATE
                    </span>

                    <h2 id="task-create-title">
                        Add a new task
                    </h2>

                    <p>
                        Start with one small step.
                    </p>
                </div>

                <form
                    onSubmit={handleAddTask}
                    aria-busy={adding}
                    className="task-create__form"
                >
                    <label htmlFor="new-task-title">
                        New task
                    </label>

                    <div className="task-create__controls">
                        <input
                            id="new-task-title"
                            type="text"
                            placeholder="Enter a new task..."
                            value={newTaskTitle}
                            maxLength={100}
                            onChange={(event) =>
                                setNewTaskTitle(event.target.value)
                            }
                            required
                            disabled={
                                loading ||
                                adding ||
                                loadError !== null
                            }
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
                            <span aria-hidden="true">＋</span>
                        </button>
                    </div>

                    {adding && (
                        <p
                            className="task-create__status"
                            role="status"
                        >
                            Створюємо завдання...
                        </p>
                    )}
                </form>
            </section>

            {/* REQUEST FEEDBACK */}

            {actionError && (
                <div
                    className="task-feedback task-feedback--error"
                    role="alert"
                >
                    {actionError}
                </div>
            )}

            {loading && (
                <div className="task-feedback" role="status">
                    Завантажуємо завдання...
                </div>
            )}

            {loadError && (
                <div
                    className="task-feedback task-feedback--error"
                    role="alert"
                >
                    <h2>Не вдалося завантажити завдання</h2>

                    <p>{loadError}</p>

                    <button
                        type="button"
                        onClick={() =>
                            setRetryCount((current) => current + 1)
                        }
                    >
                        Спробувати знову
                    </button>
                </div>
            )}

            {/* TASK LIST */}

            {!loading && !loadError && (
                <section
                    className="task-board"
                    aria-labelledby="task-board-title"
                >
                    <div className="task-section-heading">
                        <span className="task-page__eyebrow">
                            03 / YOUR TASKS
                        </span>

                        <h2 id="task-board-title">
                            My tasks
                        </h2>

                        <p>
                            Manage your tasks and mark them
                            as completed.
                        </p>
                    </div>

                    <div className="task-board__toolbar">
                        <div
                            className="task-board__filters"
                            aria-label="Filter tasks"
                        >
                            <button
                                type="button"
                                aria-pressed={filter === "all"}
                                className={
                                    filter === "all"
                                        ? "is-active"
                                        : ""
                                }
                                onClick={() => setFilter("all")}
                            >
                                All
                            </button>

                            <button
                                type="button"
                                aria-pressed={filter === "active"}
                                className={
                                    filter === "active"
                                        ? "is-active"
                                        : ""
                                }
                                onClick={() => setFilter("active")}
                            >
                                Active
                            </button>

                            <button
                                type="button"
                                aria-pressed={filter === "completed"}
                                className={
                                    filter === "completed"
                                        ? "is-active"
                                        : ""
                                }
                                onClick={() => setFilter("completed")}
                            >
                                Finished
                            </button>
                        </div>

                        <label className="task-board__search">
                            <span className="visually-hidden">
                                Search tasks
                            </span>

                            <input
                                type="search"
                                placeholder="Search your tasks..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />
                        </label>
                    </div>

                    {tasks.length === 0 ? (
                        <div className="task-empty">
                            <span aria-hidden="true">✦</span>

                            <h3>No tasks yet</h3>

                            <p>
                                Завдань поки немає.
                                Створіть своє перше!
                            </p>
                        </div>
                    ) : visibleTasks.length === 0 ? (
                        <div className="task-empty">
                            <span aria-hidden="true">⌕</span>

                            <h3>Nothing found</h3>

                            <p>
                                Спробуйте змінити пошук
                                або вибрати інший фільтр.
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setFilter("all");
                                }}
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <ul className="task-list">
                            {visibleTasks.map((task) => (
                                <li
                                    key={task.id}
                                    className={
                                        `task-item ${task.completed
                                            ? "is-completed"
                                            : ""
                                        }`
                                    }
                                >
                                    <div className="task-item__main">
                                        <label className="task-item__label">
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                disabled={
                                                    busyTaskId !== null
                                                }
                                                onChange={() => {
                                                    void toggleTask(task.id);
                                                }}
                                            />

                                            <span className="task-item__title">
                                                {task.title}
                                            </span>
                                        </label>

                                        <span className="task-item__status">
                                            {task.completed
                                                ? "Completed"
                                                : "In progress"}
                                        </span>

                                        {busyTaskId === task.id &&
                                            busyTaskAction === "toggle" && (
                                                <span
                                                    className="task-item__busy"
                                                    role="status"
                                                >
                                                    Оновлюємо...
                                                </span>
                                            )}
                                    </div>

                                    <button
                                        type="button"
                                        className="task-item__delete"
                                        disabled={busyTaskId !== null}
                                        onClick={() => {
                                            void handleDeleteTask(task.id);
                                        }}
                                    >
                                        {busyTaskId === task.id &&
                                            busyTaskAction === "delete"
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            )}
        </main>
    );
}

export default TaskManagerPage;
