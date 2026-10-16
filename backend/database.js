const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");
const dbPath = process.env.TASKS_DB_PATH ||
    path.join(__dirname, "tasks.db");

const db = new DatabaseSync(dbPath);
db.exec("PRAGMA foreign_keys = ON");

db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0
            CHECK (completed IN (0, 1))
    )
`);


db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE COLLATE NOCASE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
`);


db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
        token_hash TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE
    )
`);


const taskColumns = db.prepare(
    "PRAGMA table_info(tasks)"
).all();

const hasUserId = taskColumns.some(
    column => column.name === "user_id"
);

if (!hasUserId) {
    db.exec(`
        ALTER TABLE tasks
        ADD COLUMN user_id INTEGER
        REFERENCES users(id)
        ON DELETE CASCADE
    `);
}

db.exec(`
    CREATE INDEX IF NOT EXISTS idx_tasks_user_id
    ON tasks(user_id)
`);



console.log("SQLite database ready!");

module.exports = db;