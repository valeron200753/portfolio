
const {
    getSessionUser
} = require("../services/session.service");

function requireAuth(req, res, next) {
    try {
        const cookieHeader = req.headers.cookie ?? "";

        const sessionCookie = cookieHeader
            .split(";")
            .map(cookie => cookie.trim())
            .find(cookie => cookie.startsWith("session="));

        const token = sessionCookie
            ? sessionCookie.slice("session=".length)
            : null;

        const user = getSessionUser(token);

        if (user === null) {
            return res.status(401).json({
                error: "Authentication required"
            });
        }

        req.user = user;
        req.sessionToken = token;

        return next();
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    requireAuth
};
