
function parseEmail(value) {
    if (typeof value !== "string") {
        return null;
    }

    const email = value.trim().toLowerCase();

    if (
        email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
        return null;
    }

    return email;
}

function isValidPassword(value) {
    return (
        typeof value === "string" &&
        value.length >= 15 &&
        value.length <= 128
    );
}

module.exports = {
    parseEmail,
    isValidPassword
};
