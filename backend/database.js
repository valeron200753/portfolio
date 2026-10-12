const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");

const db = new DatabaseSync(
    path.join(__dirname, "tasks.db")
);

db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0
            CHECK (completed IN (0, 1))
    )
`);

console.log("SQLite database ready!");

module.exports = db;