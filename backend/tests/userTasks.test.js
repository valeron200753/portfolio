
const { test } = require("node:test");
const assert = require("node:assert/strict");

process.env.TASKS_DB_PATH = ":memory:";

const db = require("../database");

const {
    getTasksForUser,
    getTaskForUser,
    createTaskForUser,
    updateTaskForUser,
    deleteTaskForUser
} = require("../services/tasks.service");

test("should return only tasks owned by the user", () => {
    // Створюємо двох користувачів
    const firstUser = db.prepare(`
        INSERT INTO users (email, password_hash)
        VALUES (?, ?)
    `).run("first@example.com", "test-only-hash");

    const secondUser = db.prepare(`
        INSERT INTO users (email, password_hash)
        VALUES (?, ?)
    `).run("second@example.com", "test-only-hash");

    const firstUserId = Number(firstUser.lastInsertRowid);
    const secondUserId = Number(secondUser.lastInsertRowid);

    // Створюємо завдання першого користувача
    const ownTask = db.prepare(`
        INSERT INTO tasks (title, completed, user_id)
        VALUES (?, ?, ?)
    `).run("Learn React", 0, firstUserId);

    // Створюємо завдання другого користувача
    const otherTask = db.prepare(`
        INSERT INTO tasks (title, completed, user_id)
        VALUES (?, ?, ?)
    `).run("Private task", 0, secondUserId);

    // Отримуємо завдання першого користувача
    const tasks = getTasksForUser(firstUserId);

    assert.deepEqual(tasks, [
        {
            id: Number(ownTask.lastInsertRowid),
            title: "Learn React",
            completed: false
        }
    ]);

    // Перевіряємо, що чуже завдання не потрапило в результат
    assert.equal(
        tasks.some(task =>
            task.id === Number(otherTask.lastInsertRowid)
        ),
        false
    );
});


test("should prevent reading another user's task", () => {
    const firstUser = db.prepare(`
        INSERT INTO users (email, password_hash)
        VALUES (?, ?)
    `).run("taskowner@example.com", "test-only-hash");

    const secondUser = db.prepare(`
        INSERT INTO users (email, password_hash)
        VALUES (?, ?)
    `).run("taskstranger@example.com", "test-only-hash");

    const firstId = Number(firstUser.lastInsertRowid);
    const secondId = Number(secondUser.lastInsertRowid);

    const ownTask = db.prepare(`
        INSERT INTO tasks (title, completed, user_id)
        VALUES (?, ?, ?)
    `).run("My task", 0, firstId);

    const privateTask = db.prepare(`
        INSERT INTO tasks (title, completed, user_id)
        VALUES (?, ?, ?)
    `).run("Secret task", 0, secondId);

    const ownTaskId = Number(ownTask.lastInsertRowid);
    const privateTaskId = Number(privateTask.lastInsertRowid);

    // Своє завдання доступне
    const found = getTaskForUser(firstId, ownTaskId);

    assert.deepEqual(found, {
        id: ownTaskId,
        title: "My task",
        completed: false
    });

    // Чуже завдання недоступне
    const forbidden = getTaskForUser(firstId, privateTaskId);

    assert.equal(forbidden, null);
});


test("should create a task for the correct user", () => {
    const firstUser = db.prepare(`
        INSERT INTO users (email, password_hash)
        VALUES (?, ?)
    `).run("create-owner@example.com", "test-only-hash");

    const secondUser = db.prepare(`
        INSERT INTO users (email, password_hash)
        VALUES (?, ?)
    `).run("create-other@example.com", "test-only-hash");

    const firstId = Number(firstUser.lastInsertRowid);
    const secondId = Number(secondUser.lastInsertRowid);

    const task = createTaskForUser(
        firstId,
        "Learn Backend Security"
    );

    assert.equal(task.title, "Learn Backend Security");
    assert.equal(task.completed, false);

    const savedTask = db.prepare(`
        SELECT user_id
        FROM tasks
        WHERE id = ?
    `).get(task.id);

    assert.equal(savedTask.user_id, firstId);

    const ownTasks = getTasksForUser(firstId);
    const otherTasks = getTasksForUser(secondId);

    assert.ok(ownTasks.some(item => item.id === task.id));

    assert.equal(
        otherTasks.some(item => item.id === task.id),
        false
    );
});


test("should update only the owner's task", () => {
    const firstUser = db.prepare(`
        INSERT INTO users (email, password_hash)
        VALUES (?, ?)
    `).run("update-owner@example.com", "test-only-hash");

    const secondUser = db.prepare(`
        INSERT INTO users (email, password_hash)
        VALUES (?, ?)
    `).run("update-other@example.com", "test-only-hash");

    const firstId = Number(firstUser.lastInsertRowid);
    const secondId = Number(secondUser.lastInsertRowid);

    const ownTask = createTaskForUser(firstId, "My task");
    const otherTask = createTaskForUser(secondId, "Private task");

    // Користувач змінює своє завдання
    const updated = updateTaskForUser(
        firstId,
        ownTask.id,
        true
    );

    assert.equal(updated.completed, true);
    assert.equal(updated.id, ownTask.id);

    // Користувач намагається змінити чуже завдання
    const forbidden = updateTaskForUser(
        firstId,
        otherTask.id,
        true
    );

    assert.equal(forbidden, null);

    // Перевіряємо, що чуже завдання залишилося незмінним
    const unchanged = getTaskForUser(
        secondId,
        otherTask.id
    );

    assert.equal(unchanged.completed, false);
});


test("should delete only the owner's task", () => {
    const firstUser = db.prepare(`
        INSERT INTO users (email, password_hash)
        VALUES (?, ?)
    `).run("delete-owner@example.com", "test-only-hash");

    const secondUser = db.prepare(`
        INSERT INTO users (email, password_hash)
        VALUES (?, ?)
    `).run("delete-other@example.com", "test-only-hash");

    const firstId = Number(firstUser.lastInsertRowid);
    const secondId = Number(secondUser.lastInsertRowid);

    const ownTask = createTaskForUser(
        firstId,
        "My task"
    );

    const otherTask = createTaskForUser(
        secondId,
        "Private task"
    );

    // Спроба видалити чуже завдання
    const forbidden = deleteTaskForUser(
        firstId,
        otherTask.id
    );

    assert.equal(forbidden, false);

    // Чуже завдання має залишитися
    const otherTaskAfter = getTaskForUser(
        secondId,
        otherTask.id
    );

    assert.ok(otherTaskAfter);

    // Видаляємо власне завдання
    const deleted = deleteTaskForUser(
        firstId,
        ownTask.id
    );

    assert.equal(deleted, true);

    // Перевіряємо, що воно справді видалене
    const ownTaskAfter = getTaskForUser(
        firstId,
        ownTask.id
    );

    assert.equal(ownTaskAfter, null);

    // Повторне видалення
    assert.equal(
        deleteTaskForUser(firstId, ownTask.id),
        false
    );
});

