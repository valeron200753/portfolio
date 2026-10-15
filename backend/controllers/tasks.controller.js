
const parseTaskId = require("../utils/parseTaskId");
const parseTaskTitle = require("../utils/parseTaskTitle");

const {
    getAllTasks,
    getTaskById,
    createTask: createTaskService,
    updateTaskCompleted,
    deleteTaskById
} = require("../services/tasks.service");

function getTasks(req, res) {
    const tasks = getAllTasks();

    res.json(tasks);
}

function getTask(req, res) {
    const id = parseTaskId(req.params.id);

    if (id === null) {
        return res.status(400).json({
            error: "Invalid task ID"
        });
    }

    const task = getTaskById(id);

    if (!task) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    res.json(task);
}

function createTask(req, res) {
    const title = parseTaskTitle(req.body?.title);

    if (title === null) {
        return res.status(400).json({
            error: "Title must contain 1 to 100 characters"
        });
    }

    const task = createTaskService(title);

    res.status(201).json(task);
}


function updateTask(req, res) {
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

    const task = updateTaskCompleted(id, completed);

    if (task === null) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    res.json(task);
}


function deleteTask(req, res) {
    const id = parseTaskId(req.params.id);

    if (id === null) {
        return res.status(400).json({
            error: "Invalid task ID"
        });
    }

    const task = deleteTaskById(id);

    if (task === null) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    res.json(task);
}




module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
};