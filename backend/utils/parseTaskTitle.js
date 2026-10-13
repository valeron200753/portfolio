function parseTaskTitle(value) {
    if (typeof value !== "string") {
        return null;
    }

    const title = value.trim();

    if (title.length === 0 || title.length > 100) {
        return null;
    }

    return title;
}

module.exports = parseTaskTitle;