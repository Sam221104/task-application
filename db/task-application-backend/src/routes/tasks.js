const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
} = require("../controllers/taskController");

// GET /tasks
router.get("/", getAllTasks);

// POST /tasks
router.post("/", createTask);

// POST /tasks/reorder
router.post("/reorder", reorderTasks);

// PATCH /tasks/:id
router.patch("/:id", updateTask);

// DELETE /tasks/:id
router.delete("/:id", deleteTask);

module.exports = router;
