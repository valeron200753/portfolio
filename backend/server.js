
const express = require("express");
const helmet = require("helmet");
const {
    loginLimiter,
    registerLimiter
} = require("./middleware/rateLimit.middleware");
const tasksRouter = require("./routes/tasks.routes");
const authRouter = require("./routes/auth.routes");
const {
    csrfOriginGuard
} = require("./middleware/csrf.middleware");
const app = express();
const PORT = process.env.PORT || 3001;

// Захисні HTTP-заголовки
app.use(helmet());

// Обмеження розміру JSON
app.use(express.json({
    limit: "100kb"
}));

app.get("/", (req, res) => {
    res.send("Hello from my first backend!");
});
// Перевірка походження запитів до API
app.use("/api", csrfOriginGuard);

// Обмеження спроб входу та реєстрації
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/register", registerLimiter);

// Маршрути авторизації
app.use("/api/auth", authRouter);

// Маршрути завдань
app.use("/api/tasks", tasksRouter);

app.use("/api", (req, res) => {
    res.status(404).json({
        error: "API route not found"
    });
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            error: "Invalid JSON"
        });
    }

    console.error("Unhandled server error:", err);

    res.status(500).json({
        error: "Internal server error"
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
