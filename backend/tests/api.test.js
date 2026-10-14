const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");

process.env.TASKS_DB_PATH = ":memory:";

const app = require("../server");

let server;
let baseURL;

before(async () => {
    server = await new Promise((resolve) => {
        const instance = app.listen(0, "127.0.0.1", () => {
            resolve(instance);
        });
    });

    const port = server.address().port;
    baseURL = `http://127.0.0.1:${port}`;
});

after(async () => {
    if (!server) return;

    await new Promise((resolve, reject) => {
        server.close((err) => {
            if (err) return reject(err);
            resolve();
        });
    });
});

test("GET /api/bananas should return 404", async () => {
    const response = await fetch(`${baseURL}/api/bananas`);

    assert.equal(response.status, 404);

    const data = await response.json();

    assert.deepEqual(data, {
        error: "API route not found"
    });
});

test("GET /api/tasks/banana should return 400", async () => {
    const response = await fetch(`${baseURL}/api/tasks/banana`);

    assert.equal(response.status, 400);

    const data = await response.json();

    assert.deepEqual(data, {
        error: "Invalid task ID"
    });
});
test("POST /api/tasks should create a task", async () => {
    const response = await fetch(`${baseURL}/api/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: "   Learn Testing   "
        })
    });

    assert.equal(response.status, 201);

    const task = await response.json();

    assert.ok(Number.isSafeInteger(task.id) && task.id > 0);
    assert.equal(task.title, "Learn Testing");
    assert.equal(task.completed, false);

    const getResponse = await fetch(
        `${baseURL}/api/tasks/${task.id}`
    );

    assert.equal(getResponse.status, 200);

    const savedTask = await getResponse.json();

    assert.deepEqual(savedTask, task);
});

test("POST /api/tasks should reject invalid title", async () => {
    const beforeResponse = await fetch(`${baseURL}/api/tasks`);
    assert.equal(beforeResponse.status, 200);

    const tasksBefore = await beforeResponse.json();

    const response = await fetch(`${baseURL}/api/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: 123
        })
    });

    assert.equal(response.status, 400);

    const data = await response.json();

    assert.deepEqual(data, {
        error: "Title must contain 1 to 100 characters"
    });

    const afterResponse = await fetch(`${baseURL}/api/tasks`);
    assert.equal(afterResponse.status, 200);

    const tasksAfter = await afterResponse.json();

    assert.equal(tasksAfter.length, tasksBefore.length);
});