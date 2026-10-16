
const {
    randomBytes,
    scrypt,
    timingSafeEqual
} = require("node:crypto");
const { promisify } = require("node:util");

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
    if (typeof password !== "string" || password.length === 0) {
        throw new TypeError("Password must be a non-empty string");
    }

    const salt = randomBytes(16).toString("hex");

    const derivedKey = await scryptAsync(password, salt, 64);

    return `${salt}:${derivedKey.toString("hex")}`;
}


async function verifyPassword(password, storedHash) {
    if (typeof password !== "string" || password.length === 0) {
        return false;
    }

    if (typeof storedHash !== "string") {
        return false;
    }

    const parts = storedHash.split(":");

    if (parts.length !== 2) {
        return false;
    }

    const [salt, hashHex] = parts;

    if (!/^[0-9a-f]{32}$/.test(salt) ||
        !/^[0-9a-f]{128}$/.test(hashHex)) {
        return false;
    }

    const savedKey = Buffer.from(hashHex, "hex");

    const derivedKey = await scryptAsync(
        password,
        salt,
        savedKey.length
    );

    return timingSafeEqual(savedKey, derivedKey);
}


module.exports = {
    hashPassword,
    verifyPassword
};