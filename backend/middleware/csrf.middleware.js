
const SAFE_METHODS = new Set([
    "GET",
    "HEAD",
    "OPTIONS"
]);

const defaultDevOrigins =
    "http://localhost:5173,http://127.0.0.1:5173";

const configuredOrigins =
    process.env.FRONTEND_ORIGINS ??
    (process.env.NODE_ENV === "production"
        ? ""
        : defaultDevOrigins);

const allowedOrigins = new Set(
    configuredOrigins
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
);

if (allowedOrigins.size === 0) {
    throw new Error(
        "FRONTEND_ORIGINS must be configured"
    );
}

function csrfOriginGuard(req, res, next) {
    // Безпечні HTTP-методи пропускаємо
    if (SAFE_METHODS.has(req.method)) {
        return next();
    }

    const origin = req.get("Origin");

    // Origin відсутній або не дозволений
    if (!origin || !allowedOrigins.has(origin)) {
        return res.status(403).json({
            error: "Forbidden origin"
        });
    }

    return next();
}

module.exports = {
    csrfOriginGuard
};
