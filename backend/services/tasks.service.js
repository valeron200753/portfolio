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




module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTaskCompleted,
    deleteTaskById
};