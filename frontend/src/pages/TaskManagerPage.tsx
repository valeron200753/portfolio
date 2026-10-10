import { useState, type FormEvent } from "react";
import type { Task } from "../types/task";
import useLocalStorage from "../hooks/useLocalStorage";
function TaskManagerPage() {
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", [
        {
            id: 1,
            title: "Learn React",
            completed: false
        },
        {
            id: 2,
            title: "Practice TypeScript",
            completed: true
        },
        {
            id: 3,
            title: "Build Task Manager",
            completed: false
        }
    ]);
    function handleAddTask(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const title = newTaskTitle.trim();

        if (title === "") {
            return;
        }

        setTasks((currentTasks) => {
            const nextId =
                Math.max(0, ...currentTasks.map(task => task.id)) + 1;

            const newTask: Task = {
                id: nextId,
                title: title,
                completed: false
            };

            return [...currentTasks, newTask];
        });

        setNewTaskTitle("");
    }
    function toggleTask(id: number) {
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === id
                    ? { ...task, completed: !task.completed }
                    : task
            )
        );
    }
    function deleteTask(id: number) {
        setTasks((currentTasks) =>
            currentTasks.filter((task) => task.id !== id)
        );
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