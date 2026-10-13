function parseTaskId(value) {
    const id = Number(value);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return null;
    }

    return id;
}

module.exports = parseTaskId;