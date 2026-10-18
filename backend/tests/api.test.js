
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");

// Тестова БД в пам'яті.
// Цей рядок має бути ДО імпортів Backend.
process.env.TASKS_DB_PATH = ":memory:";

const app = require("../server");
const db = require("../database");

const {
    createSession,
    getSessionUser
} = require("../services/session.service");

const TRUSTED_ORIGIN = "http://localhost:5173";

let server;
let baseURL;
let testCookie;

// ==================================
// SETUP / TEARDOWN
// ==================================

before(async () => {
    const result = db.prepare(`
        INSERT INTO users (email, password_hash)
        VALUES (?, ?)
    `).run(
        "legacy-tests@example.com",
        "test-only-hash"
    );

    const userId = Number(result.lastInsertRowid);
    const token = createSession(userId);

    testCookie = `session=${token}`;

    server = await new Promise((resolve) => {
        const instance = app.listen(
            0,
            "127.0.0.1",
            () => resolve(instance)
        );
    });

    baseURL = `http://127.0.0.1:${server.address().port}`;
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

// ==================================
// HELPERS
// ==================================

function countUsers() {
    return db.prepare(
        "SELECT COUNT(*) AS total FROM users"
    ).get().total;
}

function countTasks() {
    return db.prepare(
        "SELECT COUNT(*) AS total FROM tasks"
    ).get().total;
}

function makeTestUser(email) {
    const result = db.prepare(`
        INSERT INTO users (email, password_hash)
        VALUES (?, ?)
    `).run(email, "test-only-hash");

    return Number(result.lastInsertRowid);
}

function makeTestTask(title, userId, completed = 0) {
    const result = db.prepare(`
        INSERT INTO tasks (title, completed, user_id)
        VALUES (?, ?, ?)
    `).run(title, completed, userId);

    return Number(result.lastInsertRowid);
}

// Cookie додаємо тільки за потреби.
// Origin додаємо для звичайних запитів,
// які змінюють стан.
function mutationHeaders(cookie = null) {
    const headers = {
        Origin: TRUSTED_ORIGIN
    };

    if (cookie !== null) {
        headers.Cookie = cookie;
    }

    return headers;
}

function jsonHeaders(cookie = null) {
    return {
        ...mutationHeaders(cookie),
        "Content-Type": "application/json"
    };
}

function get(path, cookie = null) {
    return fetch(`${baseURL}${path}`, {
        headers: cookie === null
            ? {}
            : { Cookie: cookie }
    });
}

function postJSON(path, body, cookie = null) {
    return fetch(`${baseURL}${path}`, {
        method: "POST",
        headers: jsonHeaders(cookie),
        body: JSON.stringify(body)
    });
}

function patchJSON(path, body, cookie = null) {
    return fetch(`${baseURL}${path}`, {
        method: "PATCH",
        headers: jsonHeaders(cookie),
        body: JSON.stringify(body)
    });
}

function sendDELETE(path, cookie = null) {
    return fetch(`${baseURL}${path}`, {
        method: "DELETE",
        headers: mutationHeaders(cookie)
    });
}

async function registerAndLogin(credentials) {
    const registerResponse = await postJSON(
        "/api/auth/register",
        credentials
    );

    assert.equal(registerResponse.status, 201);

    const registeredUser = await registerResponse.json();

    const loginResponse = await postJSON(
        "/api/auth/login",
        credentials
    );

    assert.equal(loginResponse.status, 200);

    const setCookie = loginResponse.headers.get(
        "set-cookie"
    );

    assert.ok(setCookie);

    return {
        registeredUser,
        loginResponse,
        setCookie,
        sessionCookie: setCookie.split(";")[0]
    };
}

// ==================================
// CRUD TESTS
// ==================================

test("GET /api/bananas should return 404", async () => {
    const response = await get("/api/bananas");

    assert.equal(response.status, 404);

    assert.deepEqual(await response.json(), {
        error: "API route not found"
    });
});

test("GET /api/tasks/banana should return 400", async () => {
    const response = await get(
        "/api/tasks/banana",
        testCookie
    );

    assert.equal(response.status, 400);

    assert.deepEqual(await response.json(), {
        error: "Invalid task ID"
    });
});

test("POST /api/tasks should create a task", async () => {
    const response = await postJSON(
        "/api/tasks",
        {
            title: "   Learn Testing   "
        },
        testCookie
    );

    assert.equal(response.status, 201);

    const task = await response.json();

    assert.ok(
        Number.isSafeInteger(task.id) && task.id > 0
    );

    assert.equal(task.title, "Learn Testing");
    assert.equal(task.completed, false);

    const getResponse = await get(
        `/api/tasks/${task.id}`,
        testCookie
    );

    assert.equal(getResponse.status, 200);

    assert.deepEqual(
        await getResponse.json(),
        task
    );
});

test("POST /api/tasks should reject invalid title", async () => {
    const beforeCount = countTasks();

    const response = await postJSON(
        "/api/tasks",
        {
            title: ""
        },
        testCookie
    );

    assert.equal(response.status, 400);

    assert.equal(countTasks(), beforeCount);
});

test("PATCH /api/tasks/:id should update a task", async () => {
    const createResponse = await postJSON(
        "/api/tasks",
        {
            title: "Learn PATCH"
        },
        testCookie
    );

    assert.equal(createResponse.status, 201);

    const createdTask = await createResponse.json();

    const response = await patchJSON(
        `/api/tasks/${createdTask.id}`,
        {
            completed: true
        },
        testCookie
    );

    assert.equal(response.status, 200);

    const updatedTask = await response.json();

    assert.deepEqual(updatedTask, {
        ...createdTask,
        completed: true
    });

    const getResponse = await get(
        `/api/tasks/${createdTask.id}`,
        testCookie
    );

    assert.equal(getResponse.status, 200);

    assert.deepEqual(
        await getResponse.json(),
        updatedTask
    );
});

test("DELETE /api/tasks/:id should delete a task", async () => {
    const createResponse = await postJSON(
        "/api/tasks",
        {
            title: "Task to delete"
        },
        testCookie
    );

    assert.equal(createResponse.status, 201);

    const task = await createResponse.json();

    const response = await sendDELETE(
        `/api/tasks/${task.id}`,
        testCookie
    );

    assert.equal(response.status, 200);

    assert.deepEqual(
        await response.json(),
        task
    );

    const getResponse = await get(
        `/api/tasks/${task.id}`,
        testCookie
    );

    assert.equal(getResponse.status, 404);

    assert.deepEqual(await getResponse.json(), {
        error: "Task not found"
    });
});

// ==================================
// REGISTRATION TESTS
// ==================================

test("POST /api/auth/register should create a user", async () => {
    const response = await postJSON(
        "/api/auth/register",
        {
            email: "  TEST@Example.COM  ",
            password: "ExamplePassword123!"
        }
    );

    assert.equal(response.status, 201);

    const user = await response.json();

    assert.ok(
        Number.isSafeInteger(user.id) && user.id > 0
    );

    assert.equal(user.email, "test@example.com");
    assert.equal(typeof user.created_at, "string");
    assert.equal(user.password, undefined);
    assert.equal(user.password_hash, undefined);
});

test("POST /api/auth/register should reject duplicate email", async () => {
    const first = await postJSON(
        "/api/auth/register",
        {
            email: "duplicate@example.com",
            password: "ExamplePassword123!"
        }
    );

    assert.equal(first.status, 201);

    const second = await postJSON(
        "/api/auth/register",
        {
            email: "DUPLICATE@EXAMPLE.COM",
            password: "AnotherPassword123!"
        }
    );

    assert.equal(second.status, 409);

    assert.deepEqual(await second.json(), {
        error: "Email already registered"
    });
});

test("POST /api/auth/register should reject invalid email", async () => {
    const beforeCount = countUsers();

    const response = await postJSON(
        "/api/auth/register",
        {
            email: "not-an-email",
            password: "ExamplePassword123!"
        }
    );

    assert.equal(response.status, 400);

    assert.deepEqual(await response.json(), {
        error: "Invalid email"
    });

    assert.equal(countUsers(), beforeCount);
});

test("POST /api/auth/register should reject short password", async () => {
    const beforeCount = countUsers();

    const response = await postJSON(
        "/api/auth/register",
        {
            email: "newuser@example.com",
            password: "12345"
        }
    );

    assert.equal(response.status, 400);

    assert.deepEqual(await response.json(), {
        error: "Password must contain 15 to 128 characters"
    });

    assert.equal(countUsers(), beforeCount);
});

// ==================================
// LOGIN TESTS
// ==================================

test("POST /api/auth/login should accept correct credentials", async () => {
    const {
        registeredUser,
        loginResponse
    } = await registerAndLogin({
        email: "loginuser@example.com",
        password: "ExamplePassword123!"
    });

    const loggedInUser = await loginResponse.json();

    assert.deepEqual(
        loggedInUser,
        registeredUser
    );

    assert.equal(loggedInUser.password, undefined);
    assert.equal(loggedInUser.password_hash, undefined);
});

test("POST /api/auth/login should reject wrong password", async () => {
    const registered = await postJSON(
        "/api/auth/register",
        {
            email: "wrongpassword@example.com",
            password: "CorrectPassword123!"
        }
    );

    assert.equal(registered.status, 201);

    const response = await postJSON(
        "/api/auth/login",
        {
            email: "wrongpassword@example.com",
            password: "WrongPassword123!"
        }
    );

    assert.equal(response.status, 401);

    assert.deepEqual(await response.json(), {
        error: "Invalid email or password"
    });
});

test("POST /api/auth/login should reject unknown email", async () => {
    const response = await postJSON(
        "/api/auth/login",
        {
            email: "unknownuser@example.com",
            password: "ExamplePassword123!"
        }
    );

    assert.equal(response.status, 401);

    assert.deepEqual(await response.json(), {
        error: "Invalid email or password"
    });
});

// ==================================
// SESSION TESTS
// ==================================

test("Sessions should require an existing user", () => {
    assert.throws(() => {
        db.prepare(`
            INSERT INTO sessions (
                token_hash,
                user_id,
                expires_at
            )
            VALUES (?, ?, ?)
        `).run(
            "invalid-session-test",
            -1,
            Date.now() + 60_000
        );
    }, /FOREIGN KEY constraint failed/);
});

test("POST /api/auth/login should create a session cookie", async () => {
    const credentials = {
        email: "cookieuser@example.com",
        password: "ExamplePassword123!"
    };

    const { setCookie } = await registerAndLogin(
        credentials
    );

    assert.match(setCookie, /HttpOnly/i);
    assert.match(setCookie, /SameSite=Lax/i);

    const match = setCookie.match(
        /(?:^|;\s*)session=([0-9a-f]{64})/
    );

    assert.ok(match);

    const sessionUser = getSessionUser(match[1]);

    assert.ok(sessionUser);

    assert.equal(
        sessionUser.email,
        credentials.email
    );
});

test("GET /api/auth/me should reject unauthenticated users", async () => {
    const response = await get("/api/auth/me");

    assert.equal(response.status, 401);

    assert.deepEqual(await response.json(), {
        error: "Authentication required"
    });
});

test("GET /api/auth/me should return authenticated user", async () => {
    const {
        registeredUser,
        sessionCookie
    } = await registerAndLogin({
        email: "protecteduser@example.com",
        password: "ExamplePassword123!"
    });

    const response = await get(
        "/api/auth/me",
        sessionCookie
    );

    assert.equal(response.status, 200);

    const user = await response.json();

    assert.deepEqual(user, registeredUser);
    assert.equal(user.password_hash, undefined);
});

test("POST /api/auth/logout should revoke the session", async () => {
    const { sessionCookie } = await registerAndLogin({
        email: "logoutapi@example.com",
        password: "ExamplePassword123!"
    });

    const beforeLogout = await get(
        "/api/auth/me",
        sessionCookie
    );

    assert.equal(beforeLogout.status, 200);

    const logoutResponse = await fetch(
        `${baseURL}/api/auth/logout`,
        {
            method: "POST",
            headers: mutationHeaders(sessionCookie)
        }
    );

    assert.equal(logoutResponse.status, 204);

    const clearedCookie = logoutResponse.headers.get(
        "set-cookie"
    );

    assert.ok(clearedCookie);

    assert.match(clearedCookie, /session=;/);
    assert.match(clearedCookie, /Expires=/i);

    const afterLogout = await get(
        "/api/auth/me",
        sessionCookie
    );

    assert.equal(afterLogout.status, 401);
});

// ==================================
// DATABASE OWNERSHIP TESTS
// ==================================

test("tasks should belong to users through a foreign key", () => {
    const columns = db.prepare(
        "PRAGMA table_info(tasks)"
    ).all();

    const hasUserId = columns.some(
        (column) => column.name === "user_id"
    );

    assert.equal(hasUserId, true);

    const foreignKeys = db.prepare(
        "PRAGMA foreign_key_list(tasks)"
    ).all();

    const userFK = foreignKeys.find(
        (key) =>
            key.table === "users" &&
            key.from === "user_id"
    );

    assert.ok(userFK);
    assert.equal(userFK.on_delete, "CASCADE");

    const settings = db.prepare(
        "PRAGMA foreign_keys"
    ).get();

    assert.equal(settings.foreign_keys, 1);
});

test("GET /api/tasks/mine should return only own tasks", async () => {
    const firstId = makeTestUser(
        "owner-api@example.com"
    );

    const secondId = makeTestUser(
        "other-api@example.com"
    );

    const ownTaskId = makeTestTask(
        "My private task",
        firstId
    );

    makeTestTask(
        "Someone else's task",
        secondId
    );

    const unauthorized = await get(
        "/api/tasks/mine"
    );

    assert.equal(unauthorized.status, 401);

    const token = createSession(firstId);

    const response = await get(
        "/api/tasks/mine",
        `session=${token}`
    );

    assert.equal(response.status, 200);

    assert.deepEqual(await response.json(), [
        {
            id: ownTaskId,
            title: "My private task",
            completed: false
        }
    ]);
});

test("GET /api/tasks/mine/:id should enforce ownership", async () => {
    const firstId = makeTestUser(
        "http-owner@example.com"
    );

    const secondId = makeTestUser(
        "http-stranger@example.com"
    );

    const ownTaskId = makeTestTask(
        "My protected task",
        firstId
    );

    const otherTaskId = makeTestTask(
        "Another user's task",
        secondId
    );

    const cookie = `session=${createSession(firstId)}`;

    const own = await get(
        `/api/tasks/mine/${ownTaskId}`,
        cookie
    );

    assert.equal(own.status, 200);

    const task = await own.json();

    assert.equal(task.id, ownTaskId);
    assert.equal(task.title, "My protected task");

    const other = await get(
        `/api/tasks/mine/${otherTaskId}`,
        cookie
    );

    assert.equal(other.status, 404);

    const unauthorized = await get(
        `/api/tasks/mine/${ownTaskId}`
    );

    assert.equal(unauthorized.status, 401);
});

test("POST /api/tasks/mine should create task for authenticated user", async () => {
    const firstId = makeTestUser(
        "post-owner@example.com"
    );

    const secondId = makeTestUser(
        "post-other@example.com"
    );

    const token = createSession(firstId);

    const response = await postJSON(
        "/api/tasks/mine",
        {
            title: "My secured task",
            userId: secondId
        },
        `session=${token}`
    );

    assert.equal(response.status, 201);

    const task = await response.json();

    assert.equal(task.title, "My secured task");
    assert.equal(task.completed, false);

    const savedTask = db.prepare(`
        SELECT user_id
        FROM tasks
        WHERE id = ?
    `).get(task.id);

    assert.equal(savedTask.user_id, firstId);
    assert.notEqual(savedTask.user_id, secondId);

    const unauthorized = await postJSON(
        "/api/tasks/mine",
        {
            title: "Unauthorized task"
        }
    );

    assert.equal(unauthorized.status, 401);
});

// ==================================
// AUTHENTICATION GUARD TESTS
// ==================================

test("GET /api/tasks should require authentication", async () => {
    const response = await get("/api/tasks");

    assert.equal(response.status, 401);
});

test("GET /api/tasks/:id should require authentication", async () => {
    const taskId = makeTestTask(
        "Protected task test",
        null
    );

    const response = await get(
        `/api/tasks/${taskId}`
    );

    assert.equal(response.status, 401);
});

test("POST /api/tasks should require authentication", async () => {
    const beforeCount = countTasks();

    // Origin є, але cookie НЕ передаємо
    const response = await postJSON(
        "/api/tasks",
        {
            title: "Unauthorized task"
        }
    );

    assert.equal(response.status, 401);

    assert.equal(countTasks(), beforeCount);
});

test("PATCH /api/tasks/:id should require authentication", async () => {
    const userId = makeTestUser(
        "patch-unauthorized@example.com"
    );

    const taskId = makeTestTask(
        "Protected PATCH task",
        userId
    );

    const response = await patchJSON(
        `/api/tasks/${taskId}`,
        {
            completed: true
        }
    );

    assert.equal(response.status, 401);

    const savedTask = db.prepare(`
        SELECT completed
        FROM tasks
        WHERE id = ?
    `).get(taskId);

    assert.equal(savedTask.completed, 0);
});

test("DELETE /api/tasks/:id should require authentication", async () => {
    const userId = makeTestUser(
        "delete-unauthorized@example.com"
    );

    const taskId = makeTestTask(
        "Protected DELETE task",
        userId
    );

    const response = await sendDELETE(
        `/api/tasks/${taskId}`
    );

    assert.equal(response.status, 401);

    const savedTask = db.prepare(`
        SELECT id, title
        FROM tasks
        WHERE id = ?
    `).get(taskId);

    assert.ok(savedTask);

    assert.equal(
        savedTask.title,
        "Protected DELETE task"
    );
});

test("DELETE /api/tasks/:id should not delete another user's task", async () => {
    const ownerId = makeTestUser(
        "delete-owner@example.com"
    );

    const strangerId = makeTestUser(
        "delete-stranger@example.com"
    );

    const taskId = makeTestTask(
        "My private task",
        ownerId
    );

    const cookie = `session=${createSession(strangerId)}`;

    const response = await sendDELETE(
        `/api/tasks/${taskId}`,
        cookie
    );

    assert.equal(response.status, 404);

    const savedTask = db.prepare(`
        SELECT id, title, user_id
        FROM tasks
        WHERE id = ?
    `).get(taskId);

    assert.ok(savedTask);

    assert.equal(savedTask.id, taskId);
    assert.equal(savedTask.user_id, ownerId);
    assert.equal(savedTask.title, "My private task");
});

test("PATCH /api/tasks/:id should not update another user's task", async () => {
    const ownerId = makeTestUser(
        "patch-owner@example.com"
    );

    const strangerId = makeTestUser(
        "patch-stranger@example.com"
    );

    const taskId = makeTestTask(
        "My private PATCH task",
        ownerId
    );

    const cookie = `session=${createSession(strangerId)}`;

    const response = await patchJSON(
        `/api/tasks/${taskId}`,
        {
            completed: true
        },
        cookie
    );

    assert.equal(response.status, 404);

    const savedTask = db.prepare(`
        SELECT id, title, completed, user_id
        FROM tasks
        WHERE id = ?
    `).get(taskId);

    assert.ok(savedTask);

    assert.equal(savedTask.id, taskId);
    assert.equal(savedTask.user_id, ownerId);
    assert.equal(savedTask.completed, 0);

    assert.equal(
        savedTask.title,
        "My private PATCH task"
    );
});

// ==================================
// CSRF TESTS
// ==================================

test("POST /api/tasks should reject foreign Origin", async () => {
    const userId = makeTestUser(
        "csrf-owner@example.com"
    );

    const token = createSession(userId);

    const beforeCount = db.prepare(`
        SELECT COUNT(*) AS total
        FROM tasks
        WHERE user_id = ?
    `).get(userId).total;

    // Origin навмисно недозволений
    const response = await fetch(
        `${baseURL}/api/tasks`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Origin: "https://attacker.example",
                Cookie: `session=${token}`
            },
            body: JSON.stringify({
                title: "Unexpected task"
            })
        }
    );

    assert.equal(response.status, 403);

    const afterCount = db.prepare(`
        SELECT COUNT(*) AS total
        FROM tasks
        WHERE user_id = ?
    `).get(userId).total;

    assert.equal(afterCount, beforeCount);
});

test("POST /api/tasks should reject missing Origin", async () => {
    const userId = makeTestUser(
        "csrf-missing-origin@example.com"
    );

    const token = createSession(userId);

    const beforeCount = db.prepare(`
        SELECT COUNT(*) AS total
        FROM tasks
        WHERE user_id = ?
    `).get(userId).total;

    // Origin тут навмисно ВІДСУТНІЙ
    const response = await fetch(
        `${baseURL}/api/tasks`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `session=${token}`
            },
            body: JSON.stringify({
                title: "Task without Origin"
            })
        }
    );

    assert.equal(response.status, 403);

    const afterCount = db.prepare(`
        SELECT COUNT(*) AS total
        FROM tasks
        WHERE user_id = ?
    `).get(userId).total;

    assert.equal(afterCount, beforeCount);
});
