
const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");

const isProduction =
    process.env.NODE_ENV === "production";

const configuredPath = process.env.TASKS_DB_PATH;

// У Production потрібна постійна файлова база.
// Використання :memory: забороняємо.
if (isProduction) {
    if (
        !configuredPath ||
        configuredPath === ":memory:" ||
        !path.isAbsolute(configuredPath)
    ) {
        throw new Error(
            "Production requires an absolute " +
            "TASKS_DB_PATH on persistent storage"
        );
    }
}

const dbPath = configuredPath ||
    path.join(__dirname, "tasks.db");

const db = new DatabaseSync(dbPath);

// Зберігаємо перевірку зовнішніх ключів
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