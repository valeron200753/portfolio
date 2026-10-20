
const {
    parseEmail,
    isValidPassword
} = require("../utils/validateRegistration");

const {
    registerUser,
    authenticateUser
} = require("../services/auth.service");

const {
    createSession,
    SESSION_DURATION_MS
} = require("../services/session.service");

const {
    revokeSession
} = require("../services/session.service");
async function register(req, res, next) {
    try {
        const { email, password } = req.body ?? {};

        const normalizedEmail = parseEmail(email);

        if (normalizedEmail === null) {
            return res.status(400).json({
                error: "Invalid email"
            });
        }

        if (!isValidPassword(password)) {
            return res.status(400).json({
                error: "Password must contain 15 to 128 characters"
            });
        }

        const user = await registerUser(
            normalizedEmail,
            password
        );

        if (user === null) {
            return res.status(409).json({
                error: "Email already registered"
            });
        }

        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
}


async function login(req, res, next) {
    try {
        const { email, password } = req.body ?? {};

        const normalizedEmail = parseEmail(email);

        if (
            normalizedEmail === null ||
            typeof password !== "string" ||
            password.length === 0
        ) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const user = await authenticateUser(
            normalizedEmail,
            password
        );


        if (user === null) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const token = createSession(user.id);

        res.cookie("session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/api",
            maxAge: SESSION_DURATION_MS
        });

        return res.status(200).json(user);



    } catch (err) {
        next(err);
    }
}

function getMe(req, res) {
    return res.status(200).json(req.user);
}


function logout(req, res, next) {
    try {
        revokeSession(req.sessionToken);

        res.clearCookie("session", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/api"
        });

        return res.status(204).send();
    } catch (err) {
        return next(err);
    }
}



module.exports = {
    register,
    login,
    getMe,
    logout
};