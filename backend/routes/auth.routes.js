
const express = require("express");

const {
    register,
    login,
    getMe,
    logout
} = require("../controllers/auth.controller");

const {
    requireAuth
} = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", requireAuth, getMe);
router.post("/logout", requireAuth, logout);

module.exports = router;
