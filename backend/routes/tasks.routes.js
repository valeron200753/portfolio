
const express = require("express");

const {
    getMyTasks,
    getMyTask,
    createMyTask,
    updateMyTask,
    deleteMyTask
} = require("../controllers/tasks.controller");

const {
    requireAuth
} = require("../middleware/auth.middleware");

const router = express.Router();

// Всі маршрути нижче потребують авторизації
router.use(requireAuth);

// Сумісність зі старими маршрутами /mine
router.get("/mine", getMyTasks);
router.get("/mine/:id", getMyTask);
router.post("/mine", createMyTask);

// Основний захищений CRUD API
router.get("/", getMyTasks);
router.get("/:id", getMyTask);

router.post("/", createMyTask);

router.patch("/:id", updateMyTask);

router.delete("/:id", deleteMyTask);

module.exports = router;
