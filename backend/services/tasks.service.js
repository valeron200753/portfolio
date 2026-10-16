const db = require("../database");

function getAllTasks() {
    const rows = db.prepare(
        "SELECT * FROM tasks"
    ).all();

    return rows.map((row) => ({
        id: row.id,
        title: row.title,
        completed: Boolean(row.completed)
    }));
}
function getTaskById(id) {
    const task = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(id);

    if (!task) {
        return null;
    }

    return {
        id: task.id,
        title: task.title,
        completed: Boolean(task.completed)
    };
}

function createTask(title) {
    const result = db.prepare(
        "INSERT INTO tasks (title, completed) VALUES (?, ?)"
    ).run(title, 0);

    const task = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(Number(result.lastInsertRowid));

    return {
        id: task.id,
        title: task.title,
        completed: Boolean(task.completed)
    };
}

function updateTaskCompleted(id, completed) {
    const result = db.prepare(
        "UPDATE tasks SET completed = ? WHERE id = ?"
    ).run(completed ? 1 : 0, id);

    if (result.changes === 0) {
        return null;
    }

    return getTaskById(id);
}


function deleteTaskById(id) {
    const task = getTaskById(id);

    if (task === null) {
        return null;
    }

    const result = db.prepare(
        "DELETE FROM tasks WHERE id = ?"
    ).run(id);

    if (result.changes === 0) {
        return null;
    }

    return task;
}


function getTasksForUser(userId) {
    const tasks = db.prepare(`
        SELECT id, title, completed
        FROM tasks
        WHERE user_id = ?
        ORDER BY id DESC
    `).all(userId);

    return tasks.map(task => ({
        ...task,
        completed: task.completed === 1
    }));
}


function getTaskForUser(userId, taskId) {
    const task = db.prepare(`
        SELECT id, title, completed
        FROM tasks
        WHERE id = ? AND user_id = ?
    `).get(taskId, userId);

    if (!task) {
        return null;
    }

    return {
        ...task,
        completed: task.completed === 1
    };
}


function createTaskForUser(userId, title) {
    const result = db.prepare(`
        INSERT INTO tasks (title, completed, user_id)
        VALUES (?, 0, ?)
    `).run(title, userId);

    return {
        id: Number(result.lastInsertRowid),
        title,
        completed: false
    };
}

function updateTaskForUser(userId, taskId, completed) {
    const result = db.prepare(`
        UPDATE tasks
        SET completed = ?
        WHERE id = ? AND user_id = ?
    `).run(
        completed ? 1 : 0,
        taskId,
        userId
    );

    if (result.changes === 0) {
        return null;
    }

    return getTaskForUser(userId, taskId);
}


function deleteTaskForUser(userId, taskId) {
    const result = db.prepare(`
        DELETE FROM tasks
        WHERE id = ? AND user_id = ?
    `).run(taskId, userId);

    return result.changes > 0;
}







module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTaskCompleted,
    deleteTaskById,
    getTasksForUser,
    getTaskForUser,
    createTaskForUser,
    updateTaskForUser,
    deleteTaskForUser
};