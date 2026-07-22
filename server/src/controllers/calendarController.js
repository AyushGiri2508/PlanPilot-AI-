const Schedule = require("../models/Schedule");
const asyncHandler = require("../middleware/asyncHandler");

// Get schedule entries for a date range
const getSchedule = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const filter = { user: req.user._id };

  if (startDate && endDate) {
    filter.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  } else if (startDate) {
    filter.date = { $gte: new Date(startDate) };
  }

  const schedule = await Schedule.find(filter)
    .populate("task", "title priority status estimatedHours")
    .populate("goal", "title category")
    .sort({ date: 1 });

  res.status(200).json({
    success: true,
    count: schedule.length,
    schedule,
  });
});

// Get schedule entries for a specific goal
const getScheduleByGoal = asyncHandler(async (req, res) => {
  const { goalId } = req.params;

  const schedule = await Schedule.find({
    user: req.user._id,
    goal: goalId,
  })
    .populate("task", "title priority status estimatedHours")
    .sort({ date: 1 });

  res.status(200).json({
    success: true,
    count: schedule.length,
    schedule,
  });
});

// Update a schedule entry (mark complete/missed, update hours)
const updateScheduleEntry = asyncHandler(async (req, res) => {
  const entry = await Schedule.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!entry) {
    return res.status(404).json({
      success: false,
      message: "Schedule entry not found",
    });
  }

  const { status, completedHours, notes } = req.body;

  if (status) entry.status = status;
  if (completedHours !== undefined) entry.completedHours = completedHours;
  if (notes !== undefined) entry.notes = notes;

  if (status === "Completed" && !entry.completedAt) {
    entry.completedAt = new Date();
  }

  if (status !== "Completed") {
    entry.completedAt = null;
  }

  const updated = await entry.save();

  res.status(200).json({
    success: true,
    message: "Schedule entry updated",
    schedule: updated,
  });
});

module.exports = {
  getSchedule,
  getScheduleByGoal,
  updateScheduleEntry,
};
