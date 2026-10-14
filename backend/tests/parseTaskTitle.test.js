const test = require("node:test");
const assert = require("node:assert/strict");

const parseTaskTitle = require("../utils/parseTaskTitle");

test("should accept a valid title", () => {
    assert.equal(
        parseTaskTitle("Learn React"),
        "Learn React"
    );
});

test("should trim whitespace", () => {
    assert.equal(
        parseTaskTitle("   Learn SQL   "),
        "Learn SQL"
    );
});

test("should reject empty title", () => {
    assert.equal(
        parseTaskTitle("   "),
        null
    );
});

test("should reject non-string title", () => {
    assert.equal(
        parseTaskTitle(123),
        null
    );
});

test("should reject title longer than 100 characters", () => {
    assert.equal(
        parseTaskTitle("a".repeat(101)),
        null
    );
});

test("should accept exactly 100 characters", () => {
    assert.equal(
        parseTaskTitle("a".repeat(100)),
        "a".repeat(100)
    );
});