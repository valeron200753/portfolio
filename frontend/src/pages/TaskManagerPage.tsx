import { useEffect, useState, type FormEvent } from "react";
import type { Task } from "../types/task";

function TaskManagerPage() {
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [tasks, setTasks] = useState<Task[]>([]);
    useEffect(() => {
        const controller = new AbortController();

        fetch("/api/tasks", {
            signal: controller.signal
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                return response.json() as Promise<Task[]>;
            })
            .then((data) => {
                setTasks(data);
            })
            .catch((error) => {
                if (error instanceof Error && error.name !== "AbortError") {
                    console.error("Failed to load tasks:", error);
                }
            });

        return () => controller.abort();
    }, []);
    async function handleAddTask(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const title = newTaskTitle.trim();

        if (title === "") {
            return;
        }

        try {
            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const newTask: Task = await response.json();

            setTasks((currentTasks) => [
                ...currentTasks,
                newTask
            ]);

            setNewTaskTitle("");

        } catch (error) {
            console.error("Failed to create task:", error);
            alert("Could not create task.");
        }
    }
    async function toggleTask(id: number) {
        const task = tasks.find((task) => task.id === id);

        if (!task) {
            return;
        }

        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    completed: !task.completed
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const updatedTask: Task = await response.json();

            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task.id === id ? updatedTask : task
                )
            );

        } catch (error) {
            console.error("Failed to update task:", error);
            alert("Could not update task.");
        }
    }
    async function deleteTask(id: number) {
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            setTasks((currentTasks) =>
                currentTasks.filter((task) => task.id !== id)
            );

        } catch (error) {
            console.error("Failed to delete task:", error);
            alert("Could not delete task.");
        }
    }
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        (task) => task.completed
    ).length;

    const remainingTasks = totalTasks - completedTasks;
    return (
        <main>
            <h1>Task Manager</h1>
            <form onSubmit={handleAddTask}>
                <input
                    type="text"
                    placeholder="Enter a new task..."
                    value={newTaskTitle}
                    onChange={(event) =>
                        setNewTaskTitle(event.target.value)
                    }
                />

                <button type="submit">
                    Add Task
                </button>
            </form>
            <section>
                <h2>Task Statistics</h2>

                <p>Total tasks: {totalTasks}</p>
                <p>Completed: {completedTasks}</p>
                <p>Remaining: {remainingTasks}</p>
            </section>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTask(task.id)}
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
                            onClick={() => deleteTask(task.id)}
                        >
                            Delete
                        </button>
                    </li>

                ))}

            </ul>
        </main>
    );
}

export default TaskManagerPage;