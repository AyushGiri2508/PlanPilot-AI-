const express = require("express");
const router = express.Router();

const {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  getGoalStats,
} = require("../controllers/goalController");

const { protect } = require("../middleware/authMiddleware");

const {
  createGoalValidation,
  updateGoalValidation,
} = require("../validations/goalValidations");

const taskRoutes = require("./taskRoutes");

// Nested Task Routes
router.use("/:goalId/tasks", taskRoutes);

router.use(protect);

router.get("/stats", getGoalStats);

router
  .route("/")
  .get(getGoals)
  .post(createGoalValidation, createGoal);

router
  .route("/:id")
  .get(getGoalById)
  .put(updateGoalValidation, updateGoal)
  .patch(updateGoalValidation, updateGoal)
  .delete(deleteGoal);

module.exports = router;