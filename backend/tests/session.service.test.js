
const { test } = require("node:test");
const assert = require("node:assert/strict");

process.env.TASKS_DB_PATH = ":memory:";

const db = require("../database");

const {
    createSession,
    getSessionUser,
    revokeSession
} = require("../services/session.service");
const {
    hashSessionToken
} = require("../utils/sessionToken");

test("should create and verify a session", () => {
    const result = db.prepare(`
        INSERT INTO users (email, password_hash)
        VALUES (?, ?)
    `).run("session@example.com", "test-only-hash");

    const userId = Number(result.lastInsertRowid);

    const token = createSession(userId);

    assert.match(token, /^[0-9a-f]{64}$/);

    const savedSession = db.prepare(`
        SELECT token_hash
        FROM sessions
        WHERE user_id = ?
    `).get(userId);

    assert.equal(
        savedSession.token_hash,
        hashSessionToken(token)
    );

    assert.notEqual(savedSession.token_hash, token);

    const user = getSessionUser(token);

    assert.equal(user.id, userId);
    assert.equal(user.email, "session@example.com");
    assert.equal(user.password_hash, undefined);
});

test("should reject an expired session", () => {
    const result = db.prepare(`
        INSERT INTO users (email, password_hash)
        VALUES (?, ?)
    `).run("expired@example.com", "test-only-hash");

    const userId = Number(result.lastInsertRowid);
    const token = createSession(userId);

    db.prepare(`
        UPDATE sessions
        SET expires_at = ?
        WHERE token_hash = ?
    `).run(
        Date.now() - 1000,
        hashSessionToken(token)
    );

    const user = getSessionUser(token);

    assert.equal(user, null);
});


test("should revoke an active session", () => {
    const result = db.prepare(`
        INSERT INTO users (email, password_hash)
        VALUES (?, ?)
    `).run(
        "logout@example.com",
        "test-only-hash"
    );

    const userId = Number(result.lastInsertRowid);

    // Створюємо сесію
    const token = createSession(userId);

    // Перевіряємо, що вона працює
    const userBefore = getSessionUser(token);

    assert.ok(userBefore);
    assert.equal(userBefore.id, userId);

    // Видаляємо сесію
    const revoked = revokeSession(token);

    assert.equal(revoked, true);

    // Перевіряємо, що старий токен більше не працює
    const userAfter = getSessionUser(token);

    assert.equal(userAfter, null);

    // Повторне видалення не повинно знайти сесію
    assert.equal(revokeSession(token), false);
});

