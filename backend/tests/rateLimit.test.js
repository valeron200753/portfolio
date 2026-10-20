
const { test } = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");

const {
    loginLimiter,
    registerLimiter
} = require("../middleware/rateLimit.middleware");

test("Login limiter should block request 21", async (t) => {
    const app = express();

    // Тестовий маршрут зі справжнім limiter
    app.post("/api/auth/login", loginLimiter, (req, res) => {
        res.status(200).json({
            message: "Request accepted"
        });
    });

    // Випадковий вільний порт
    const server = app.listen(0, "127.0.0.1");

    await new Promise((resolve) => {
        server.once("listening", resolve);
    });

    // Закриваємо сервер після тесту
    t.after(async () => {
        await new Promise((resolve, reject) => {
            server.close((error) => {
                if (error) reject(error);
                else resolve();
            });
        });
    });

    const port = server.address().port;
    const url = `http://127.0.0.1:${port}/api/auth/login`;

    // Перші 20 запитів дозволені
    for (let i = 1; i <= 20; i++) {
        const response = await fetch(url, {
            method: "POST"
        });

        assert.equal(
            response.status,
            200,
            `Request ${i} should succeed`
        );

        await response.text();
    }

    // Запит №21 повинен бути заблокований
    const blocked = await fetch(url, {
        method: "POST"
    });

    assert.equal(blocked.status, 429);

    const body = await blocked.json();

    assert.equal(
        body.error,
        "Too many login attempts. Try again later."
    );
});


test("Register limiter should block request 11", async (t) => {
    const app = express();

    // Окремий маршрут для тестування реєстрації
    app.post(
        "/api/auth/register",
        registerLimiter,
        (req, res) => {
            res.status(201).json({
                message: "Registration accepted"
            });
        }
    );

    // ОС сама вибирає вільний порт
    const server = app.listen(0, "127.0.0.1");

    await new Promise((resolve) => {
        server.once("listening", resolve);
    });

    // Закриваємо сервер після тесту
    t.after(async () => {
        await new Promise((resolve, reject) => {
            server.close((error) => {
                if (error) reject(error);
                else resolve();
            });
        });
    });

    const port = server.address().port;

    const url =
        `http://127.0.0.1:${port}/api/auth/register`;

    // Перші 10 запитів дозволені
    for (let i = 1; i <= 10; i++) {
        const response = await fetch(url, {
            method: "POST"
        });

        assert.equal(
            response.status,
            201,
            `Request ${i} should succeed`
        );

        await response.text();
    }

    // Одинадцятий запит блокується
    const blocked = await fetch(url, {
        method: "POST"
    });

    assert.equal(blocked.status, 429);

    const body = await blocked.json();

    assert.equal(
        body.error,
        "Too many registration attempts. Try again later."
    );
});
