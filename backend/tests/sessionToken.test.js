
const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
    createSessionToken,
    hashSessionToken
} = require("../utils/sessionToken");

test("should generate unique session tokens", () => {
    const first = createSessionToken();
    const second = createSessionToken();

    assert.match(first.token, /^[0-9a-f]{64}$/);

    assert.notEqual(first.token, second.token);

    assert.equal(
        first.tokenHash,
        hashSessionToken(first.token)
    );

    assert.notEqual(first.token, first.tokenHash);
});

test("should reject invalid session tokens", () => {
    assert.equal(hashSessionToken("invalid"), null);
    assert.equal(hashSessionToken(undefined), null);
});
