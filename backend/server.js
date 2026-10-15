
const express = require("express");
const tasksRouter = require("./routes/tasks.routes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello from my first backend!");
});

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
