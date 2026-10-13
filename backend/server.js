const parseTaskId = require("./utils/parseTaskId");
const parseTaskTitle = require("./utils/parseTaskTitle");
const express = require("express");
const db = require("./database");
const app = express();
app.use(express.json());
const PORT = 3001;

app.get("/", (req, res) => {
    res.send("Hello from my first backend!");
});
app.get("/api/tasks", (req, res) => {
    const rows = db.prepare(
        "SELECT * FROM tasks"
    ).all();

    const databaseTasks = rows.map((row) => ({
        id: row.id,
        title: row.title,
        completed: Boolean(row.completed)
    }));

    res.json(databaseTasks);
});
app.post("/api/tasks", (req, res) => {
    const title = parseTaskTitle(req.body?.title);

    if (title === null) {
        return res.status(400).json({
            error: "Title must contain 1 to 100 characters"
        });
    }

    const result = db.prepare(
        "INSERT INTO tasks (title, completed) VALUES (?, ?)"
    ).run(title, 0);

    const newTask = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(Number(result.lastInsertRowid));

    res.status(201).json({
        id: newTask.id,
        title: newTask.title,
        completed: Boolean(newTask.completed)
    });
});
app.get("/api/tasks/:id", (req, res) => {
    const id = parseTaskId(req.params.id);

    if (id === null) {
        return res.status(400).json({
            error: "Invalid task ID"
        });
    }

    const task = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(id);

    if (!task) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    res.json({
        id: task.id,
        title: task.title,
        completed: Boolean(task.completed)
    });
});
app.patch("/api/tasks/:id", (req, res) => {
    const id = parseTaskId(req.params.id);

    if (id === null) {
        return res.status(400).json({
            error: "Invalid task ID"
        });
    }

    const { completed } = req.body ?? {};

    if (typeof completed !== "boolean") {
        return res.status(400).json({
            error: "Completed must be a boolean"
        });
    }

    const result = db.prepare(
        "UPDATE tasks SET completed = ? WHERE id = ?"
    ).run(completed ? 1 : 0, id);

    if (result.changes === 0) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    const task = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(id);

    res.json({
        id: task.id,
        title: task.title,
        completed: Boolean(task.completed)
    });
});
app.delete("/api/tasks/:id", (req, res) => {
    const id = parseTaskId(req.params.id);

    if (id === null) {
        return res.status(400).json({
            error: "Invalid task ID"
        });
    }

    const task = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(id);

    if (!task) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    db.prepare(
        "DELETE FROM tasks WHERE id = ?"
    ).run(id);

    res.json({
        id: task.id,
        title: task.title,
        completed: Boolean(task.completed)
    });
});
app.use("/api", (req, res) => {
    res.status(404).json({
        error: "API route not found"
    });
});
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            error: "Invalid JSON"
        });
    }

    console.error("Unhandled server error:", err);

    res.status(500).json({
        error: "Internal server error"
    });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});