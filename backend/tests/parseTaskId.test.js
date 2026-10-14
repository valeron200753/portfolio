const test = require("node:test");
const assert = require("node:assert/strict");

const parseTaskId = require("../utils/parseTaskId");

test("should return a valid task ID", () => {
    const result = parseTaskId("5");

    assert.equal(result, 5);
});

test("should reject text instead of ID", () => {
    assert.equal(parseTaskId("banana"), null);
});

test("should reject negative ID", () => {
    assert.equal(parseTaskId("-5"), null);
});

test("should reject decimal ID", () => {
    assert.equal(parseTaskId("2.5"), null);
});

test("should reject zero ID", () => {
    assert.equal(parseTaskId("0"), null);
});