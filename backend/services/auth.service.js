
const db = require("../database");
const {
    hashPassword,
    verifyPassword
} = require("../utils/password");

async function registerUser(email, password) {
    const passwordHash = await hashPassword(password);

    const result = db.prepare(`
        INSERT INTO users (email, password_hash)
        VALUES (?, ?)
        ON CONFLICT(email) DO NOTHING
    `).run(email, passwordHash);

    if (result.changes === 0) {
        return null;
    }

    const user = db.prepare(
        "SELECT id, email, created_at FROM users WHERE id = ?"
    ).get(Number(result.lastInsertRowid));

    return user;
}


async function authenticateUser(email, password) {
    const user = db.prepare(`
        SELECT id, email, password_hash, created_at
        FROM users
        WHERE email = ?
    `).get(email);

    if (!user) {
        return null;
    }

    const isPasswordValid = await verifyPassword(
        password,
        user.password_hash
    );

    if (!isPasswordValid) {
        return null;
    }

    return {
        id: user.id,
        email: user.email,
        created_at: user.created_at
    };
}

module.exports = {
    registerUser,
    authenticateUser
};
