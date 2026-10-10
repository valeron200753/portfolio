const express = require("express");

const app = express();
app.use(express.json());
const PORT = 3001;
const tasks = [
    {
        id: 1,
        title: "Learn Node.js",
        completed: true
    },
    {
        id: 2,
        title: "Learn Express",
        completed: false
    },
    {
        id: 3,
        title: "Build REST API",
        completed: false
    }
];
app.get("/", (req, res) => {
    res.send("Hello from my first backend!");
});
app.get("/api/tasks", (req, res) => {
    res.json(tasks);
});
app.post("/api/tasks", (req, res) => {
    const title = req.body?.title;

    if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({
            error: "Task title is required"
        });
    }

    const newTask = {
        id: Math.max(0, ...tasks.map(task => task.id)) + 1,
        title: title.trim(),
        completed: false
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});
app.get("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find((task) => task.id === id);

    if (!task) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    res.json(task);
});
app.patch("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find((task) => task.id === id);

    if (!task) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    const { completed } = req.body ?? {};

    if (typeof completed !== "boolean") {
        return res.status(400).json({
            error: "Completed must be a boolean"
        });
    }

    task.completed = completed;

    res.json(task);
});
app.delete("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const taskIndex = tasks.findIndex(
        (task) => task.id === id
    );

    if (taskIndex === -1) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    res.json(deletedTask);
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});