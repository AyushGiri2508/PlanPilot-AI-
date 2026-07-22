const Goal = require("../models/Goal");
const Task = require("../models/Task");
const Schedule = require("../models/Schedule");
const asyncHandler = require("../middleware/asyncHandler");

const getAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Overall stats
  const [totalGoals, completedGoals, totalTasks, completedTasks] =
    await Promise.all([
      Goal.countDocuments({ user: userId }),
      Goal.countDocuments({ user: userId, status: "Completed" }),
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, status: "Completed" }),
    ]);

  // Task distribution by priority
  const tasksByPriority = await Task.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: "$priority",
        count: { $sum: 1 },
      },
    },
  ]);

  // Task distribution by status
  const tasksByStatus = await Task.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // Weekly completion data (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const weeklyCompletions = await Task.aggregate([
    {
      $match: {
        user: userId,
        status: "Completed",
        completedAt: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$completedAt",
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Goals with progress
  const goalsProgress = await Goal.find({ user: userId })
    .select("title progress status category deadline")
    .sort({ createdAt: -1 })
    .limit(10);

  // Schedule completion rate (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const scheduleStats = await Schedule.aggregate([
    {
      $match: {
        user: userId,
        date: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalHours: { $sum: "$plannedHours" },
        completedHours: { $sum: "$completedHours" },
      },
    },
  ]);

  // Streak from user model
  const streak = req.user.streak || 0;

  const completionRate =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalGoals,
        completedGoals,
        activeGoals: totalGoals - completedGoals,
        totalTasks,
        completedTasks,
        pendingTasks: totalTasks - completedTasks,
        completionRate,
        streak,
      },
      tasksByPriority,
      tasksByStatus,
      weeklyCompletions,
      goalsProgress,
      scheduleStats,
    },
  });
});

module.exports = {
  getAnalytics,
};
