
const db = require("../database");

const {
    createSessionToken,
    hashSessionToken
} = require("../utils/sessionToken");

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function createSession(userId) {
    const { token, tokenHash } = createSessionToken();

    const expiresAt = Date.now() + SESSION_DURATION_MS;

    db.prepare(`
        INSERT INTO sessions (
            token_hash,
            user_id,
            expires_at
        )
        VALUES (?, ?, ?)
    `).run(tokenHash, userId, expiresAt);

    return token;
}

function getSessionUser(token) {
    const tokenHash = hashSessionToken(token);

    if (tokenHash === null) {
        return null;
    }

    const user = db.prepare(`
        SELECT
            users.id,
            users.email,
            users.created_at
        FROM sessions
        JOIN users
            ON users.id = sessions.user_id
        WHERE sessions.token_hash = ?
          AND sessions.expires_at > ?
    `).get(tokenHash, Date.now());

    return user ?? null;
}


function revokeSession(token) {
    const tokenHash = hashSessionToken(token);

    if (tokenHash === null) {
        return false;
    }

    const result = db.prepare(`
        DELETE FROM sessions
        WHERE token_hash = ?
    `).run(tokenHash);

    return result.changes > 0;
}


module.exports = {
    createSession,
    getSessionUser,
    revokeSession,
    SESSION_DURATION_MS
};