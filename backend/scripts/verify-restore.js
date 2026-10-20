
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

function main() {
    const backupDir = process.env.BACKUP_DIR ||
        path.join(
            os.homedir(),
            "backups",
            "fullstack-portfolio"
        );

    const files = fs.readdirSync(backupDir)
        .filter((name) =>
            name.startsWith("backup-") &&
            name.endsWith(".sqlite3")
        )
        .sort();

    if (files.length === 0) {
        throw new Error("No backups found");
    }

    // Обираємо останню резервну копію
    const latestBackup = path.join(
        backupDir,
        files[files.length - 1]
    );

    // Окремий тимчасовий каталог
    const tempDir = fs.mkdtempSync(
        path.join(os.tmpdir(), "portfolio-restore-")
    );

    const restoredPath = path.join(
        tempDir,
        "restored.sqlite3"
    );

    let db;

    try {
        // Копіюємо вже готовий backup,
        // а не активну основну базу
        fs.copyFileSync(latestBackup, restoredPath);

        // Відкриваємо відновлену копію
        db = new DatabaseSync(restoredPath);

        // Перевіряємо цілісність
        const integrity = db
            .prepare("PRAGMA integrity_check")
            .get();

        if (integrity.integrity_check !== "ok") {
            throw new Error("Integrity check failed");
        }

        // Перевіряємо зовнішні ключі
        const foreignKeyErrors = db
            .prepare("PRAGMA foreign_key_check")
            .all();

        if (foreignKeyErrors.length > 0) {
            throw new Error(
                "Foreign key violations found"
            );
        }

        // Перевіряємо наявність таблиць
        const requiredTables = [
            "users",
            "sessions",
            "tasks"
        ];

        for (const table of requiredTables) {
            const exists = db.prepare(`
                SELECT name
                FROM sqlite_master
                WHERE type = 'table' AND name = ?
            `).get(table);

            if (!exists) {
                throw new Error(
                    `Missing table: ${table}`
                );
            }
        }

        // Показуємо кількість записів без
        // розкриття персональних даних
        const users = db.prepare(
            "SELECT COUNT(*) AS total FROM users"
        ).get().total;

        const tasks = db.prepare(
            "SELECT COUNT(*) AS total FROM tasks"
        ).get().total;

        console.log("Restore verification passed!");
        console.log("Integrity: OK");
        console.log("Foreign keys: OK");
        console.log("Users:", users);
        console.log("Tasks:", tasks);
    } finally {
        if (db) {
            db.close();
        }

        // Прибираємо лише створений
        // нами тимчасовий каталог
        fs.rmSync(tempDir, {
            recursive: true,
            force: true
        });
    }
}

try {
    main();
} catch (error) {
    console.error(
        "Restore verification failed:",
        error.message
    );

    process.exitCode = 1;
}
