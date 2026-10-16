
const parseTaskId = require("../utils/parseTaskId");
const parseTaskTitle = require("../utils/parseTaskTitle");

const {
    getAllTasks,
    getTaskById,
    createTask: createTaskService,
    updateTaskCompleted,
    deleteTaskById,
    getTasksForUser,
    getTaskForUser,
    createTaskForUser,
    updateTaskForUser,
    deleteTaskForUser
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

function getMyTasks(req, res, next) {
    try {
        const tasks = getTasksForUser(req.user.id);

        return res.status(200).json(tasks);
    } catch (err) {
        return next(err);
    }
}


function getMyTask(req, res, next) {
    try {
        const rawId = req.params.id;

        if (!/^[1-9]\d*$/.test(rawId)) {
            return res.status(400).json({
                error: "Invalid task ID"
            });
        }

        const taskId = Number(rawId);

        if (!Number.isSafeInteger(taskId)) {
            return res.status(400).json({
                error: "Invalid task ID"
            });
        }

        const task = getTaskForUser(
            req.user.id,
            taskId
        );

        if (task === null) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        return res.status(200).json(task);
    } catch (err) {
        return next(err);
    }
}


function createMyTask(req, res, next) {
    try {
        const rawTitle = req.body?.title;

        // Використай тут ті самі правила валідації
        // title, які вже застосовує createTask().
        const title = parseTaskTitle(rawTitle);

        if (title === null) {
            return res.status(400).json({
                error: "Invalid task title"
            });
        }

        const task = createTaskForUser(
            req.user.id,
            title
        );

        return res.status(201).json(task);
    } catch (err) {
        return next(err);
    }
}


function updateMyTask(req, res, next) {
    try {
        const rawId = req.params.id;

        // Перевіряємо ID завдання
        if (!/^[1-9]\d*$/.test(rawId)) {
            return res.status(400).json({
                error: "Invalid task ID"
            });
        }

        const taskId = Number(rawId);

        if (!Number.isSafeInteger(taskId)) {
            return res.status(400).json({
                error: "Invalid task ID"
            });
        }

        // Перевіряємо значення completed
        const completed = req.body?.completed;

        if (typeof completed !== "boolean") {
            return res.status(400).json({
                error: "Completed must be a boolean"
            });
        }

        // Змінюємо завдання лише його власника
        const task = updateTaskForUser(
            req.user.id,
            taskId,
            completed
        );

        if (task === null) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        return res.status(200).json(task);
    } catch (err) {
        return next(err);
    }
}


function deleteMyTask(req, res, next) {
    try {
        const rawId = req.params.id;

        // Перевіряємо правильність ID
        if (!/^[1-9]\d*$/.test(rawId)) {
            return res.status(400).json({
                error: "Invalid task ID"
            });
        }

        const taskId = Number(rawId);

        if (!Number.isSafeInteger(taskId)) {
            return res.status(400).json({
                error: "Invalid task ID"
            });
        }

        // Шукаємо тільки власне завдання
        const task = getTaskForUser(
            req.user.id,
            taskId
        );

        if (task === null) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        // Видаляємо тільки завдання власника
        const deleted = deleteTaskForUser(
            req.user.id,
            taskId
        );

        if (!deleted) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        return res.status(200).json(task);
    } catch (err) {
        return next(err);
    }
}







module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    getMyTasks,
    getMyTask,
    createMyTask,
    updateMyTask,
    deleteMyTask
};