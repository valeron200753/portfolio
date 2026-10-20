
const { rateLimit } = require("express-rate-limit");

// Обмеження спроб входу
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        error: "Too many login attempts. Try again later."
    }
});

// Обмеження кількості реєстрацій
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        error: "Too many registration attempts. Try again later."
    }
});

module.exports = {
    loginLimiter,
    registerLimiter
};
