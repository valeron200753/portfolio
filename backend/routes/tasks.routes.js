const express = require("express");

const {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
} = require("../controllers/tasks.controller");

const router = express.Router();

router.get("/", getTasks);
router.get("/:id", getTask);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;