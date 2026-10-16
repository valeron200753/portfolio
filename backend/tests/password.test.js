
const test = require("node:test");
const assert = require("node:assert/strict");

const {
    hashPassword,
    verifyPassword
} = require("../utils/password");

test("should hash a password", async () => {
    const password = "ExamplePassword123!";

    const hash = await hashPassword(password);

    assert.notEqual(hash, password);
    assert.equal(typeof hash, "string");
});

test("should generate different hashes for the same password", async () => {
    const password = "ExamplePassword123!";

    const firstHash = await hashPassword(password);
    const secondHash = await hashPassword(password);

    assert.notEqual(firstHash, secondHash);
});

test("should verify the correct password", async () => {
    const password = "ExamplePassword123!";
    const hash = await hashPassword(password);

    const result = await verifyPassword(password, hash);

    assert.equal(result, true);
});

test("should reject an incorrect password", async () => {
    const hash = await hashPassword("CorrectPassword123!");

    const result = await verifyPassword(
        "WrongPassword123!",
        hash
    );

    assert.equal(result, false);
});

test("should reject an invalid stored hash", async () => {
    const result = await verifyPassword(
        "ExamplePassword123!",
        "invalid-hash"
    );

    assert.equal(result, false);
});

