const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  createTask,
  getTasksByGoal,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");

const {
  createTaskValidation,
  updateTaskValidation,
} = require("../validations/taskValidation");

// Protect all routes
router.use(protect);

// Routes for a Goal
router
  .route("/")
  .get(getTasksByGoal)
  .post(createTaskValidation, createTask);

// Routes for a Single Task
router
  .route("/:taskId")
  .get(getTaskById)
  .put(updateTaskValidation, updateTask)
  .patch(updateTaskValidation, updateTask)
  .delete(deleteTask);

module.exports = router;