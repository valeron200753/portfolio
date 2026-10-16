
const { randomBytes, createHash } = require("node:crypto");

function hashSessionToken(token) {
    if (
        typeof token !== "string" ||
        !/^[0-9a-f]{64}$/.test(token)
    ) {
        return null;
    }

    return createHash("sha256")
        .update(token)
        .digest("hex");
}

function createSessionToken() {
    const token = randomBytes(32).toString("hex");

    return {
        token,
        tokenHash: hashSessionToken(token)
    };
}

module.exports = {
    createSessionToken,
    hashSessionToken
};
