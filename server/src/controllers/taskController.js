const Task = require("../models/Task");
const Goal = require("../models/Goal");
const asyncHandler = require("../middleware/asyncHandler");

const createTask = asyncHandler(async (req, res) => {
  const { goalId } = req.params;

  // Check goal ownership
  const goal = await Goal.findOne({
    _id: goalId,
    user: req.user._id,
  });

  if (!goal) {
    return res.status(404).json({
      success: false,
      message: "Goal not found",
    });
  }

  const task = await Task.create({
    ...req.body,
    goal: goalId,
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    task,
  });
});

const getTasksByGoal = asyncHandler(async (req, res) => {
  const { goalId } = req.params;

  const goal = await Goal.findOne({
    _id: goalId,
    user: req.user._id,
  });

  if (!goal) {
    return res.status(404).json({
      success: false,
      message: "Goal not found",
    });
  }

  const tasks = await Task.find({
    goal: goalId,
    user: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    tasks,
  });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.taskId,
    user: req.user._id,
  }).populate("goal", "title");

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  res.status(200).json({
    success: true,
    task,
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.taskId,
    user: req.user._id,
  });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  Object.assign(task, req.body);

  if (task.status === "Completed" && !task.completedAt) {
    task.completedAt = new Date();
  }

  if (task.status !== "Completed") {
    task.completedAt = null;
  }

  const updatedTask = await task.save();

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    task: updatedTask,
  });
});
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.taskId,
    user: req.user._id,
  });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
});
module.exports = {
  createTask,
  getTasksByGoal,
  getTaskById,
  updateTask,
  deleteTask,
};