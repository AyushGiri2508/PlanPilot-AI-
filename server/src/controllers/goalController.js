const Goal = require("../models/Goal");
const asyncHandler = require("../middleware/asyncHandler");


const createGoal = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    priority,
    deadline,
  } = req.body;

  const goal = await Goal.create({
    user: req.user._id,
    title,
    description,
    category,
    priority,
    deadline,
  });

  res.status(201).json({
    success: true,
    message: "Goal created successfully",
    goal,
  });
});

const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({
    user: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: goals.length,
    goals,
  });
});

const getGoalById = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!goal) {
    return res.status(404).json({
      success: false,
      message: "Goal not found",
    });
  }

  res.status(200).json({
    success: true,
    goal,
  });
});

const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!goal) {
    return res.status(404).json({
      success: false,
      message: "Goal not found",
    });
  }

  Object.assign(goal, req.body);

  const updatedGoal = await goal.save();

  res.status(200).json({
    success: true,
    message: "Goal updated successfully",
    goal: updatedGoal,
  });
});

const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!goal) {
    return res.status(404).json({
      success: false,
      message: "Goal not found",
    });
  }

  await goal.deleteOne();

  res.status(200).json({
    success: true,
    message: "Goal deleted successfully",
  });
});

const getGoalStats = asyncHandler(async (req, res) => {
  const goals = await Goal.find({
    user: req.user._id,
  });

  const total = goals.length;

  const completed = goals.filter(
    (goal) => goal.status === "Completed"
  ).length;

  const pending = goals.filter(
    (goal) => goal.status === "Pending"
  ).length;

  const inProgress = goals.filter(
    (goal) => goal.status === "In Progress"
  ).length;

  const averageProgress =
    total === 0
      ? 0
      : Math.round(
          goals.reduce((sum, goal) => sum + goal.progress, 0) / total
        );

  res.status(200).json({
    success: true,
    stats: {
      total,
      completed,
      pending,
      inProgress,
      averageProgress,
    },
  });
});

module.exports = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  getGoalStats,
};