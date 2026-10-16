
const test = require("node:test");
const assert = require("node:assert/strict");

const {
    parseEmail,
    isValidPassword
} = require("../utils/validateRegistration");

test("should accept a valid email", () => {
    assert.equal(
        parseEmail("user@example.com"),
        "user@example.com"
    );
});

test("should normalize email", () => {
    assert.equal(
        parseEmail("  USER@Example.COM  "),
        "user@example.com"
    );
});

test("should reject invalid email", () => {
    assert.equal(parseEmail("hello"), null);
});

test("should reject non-string email", () => {
    assert.equal(parseEmail(123), null);
});

test("should accept a valid password", () => {
    assert.equal(
        isValidPassword("MyLongPassword123!"),
        true
    );
});

test("should reject passwords outside length limits", () => {
    assert.equal(isValidPassword("12345"), false);
    assert.equal(isValidPassword("a".repeat(129)), false);
});
