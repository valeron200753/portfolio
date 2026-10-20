
const { DatabaseSync, backup } = require("node:sqlite");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { randomUUID } = require("node:crypto");

// Нові файли створюємо з обмеженими правами доступу.
process.umask(0o077);

async function main() {
    const isProduction =
        process.env.NODE_ENV === "production";

    const configuredPath = process.env.TASKS_DB_PATH;

    if (isProduction && (
        !configuredPath ||
        !path.isAbsolute(configuredPath)
    )) {
        throw new Error(
            "Production requires an absolute TASKS_DB_PATH"
        );
    }

    const dbPath = configuredPath ||
        path.join(__dirname, "..", "tasks.db");

    if (dbPath === ":memory:") {
        throw new Error(
            "Cannot back up an in-memory database by path"
        );
    }

    if (!fs.existsSync(dbPath)) {
        throw new Error(
            `Database file not found: ${dbPath}`
        );
    }

    const backupDir = process.env.BACKUP_DIR ||
        path.join(
            os.homedir(),
            "backups",
            "fullstack-portfolio"
        );

    fs.mkdirSync(backupDir, {
        recursive: true,
        mode: 0o700
    });

    const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-");

    const filename =
        `backup-${timestamp}-${randomUUID()}.sqlite3`;

    const destination = path.join(backupDir, filename);

    let source;

    try {
        // Відкриваємо оригінальну базу тільки для читання.
        source = new DatabaseSync(dbPath, {
            readOnly: true
        });

        // Використовуємо механізм backup SQLite.
        const pages = await backup(source, destination);

        fs.chmodSync(destination, 0o600);

        // Перевіряємо цілісність створеної копії.
        const copy = new DatabaseSync(destination, {
            readOnly: true
        });

        try {
            const result = copy
                .prepare("PRAGMA integrity_check")
                .get();

            if (result.integrity_check !== "ok") {
                throw new Error(
                    "Backup integrity check failed"
                );
            }
        } finally {
            copy.close();
        }

        console.log("Backup created successfully!");
        console.log("Destination:", destination);
        console.log("Pages backed up:", pages);
        console.log("Integrity check: OK");
    } catch (error) {
        // Не залишаємо пошкоджену або неповну копію.
        if (fs.existsSync(destination)) {
            fs.rmSync(destination);
        }

        throw error;
    } finally {
        if (source) {
            source.close();
        }
    }
}

main().catch((error) => {
    console.error("Backup failed:", error.message);
    process.exitCode = 1;
});
