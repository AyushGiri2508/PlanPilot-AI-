const Goal = require("../models/Goal");
const Task = require("../models/Task");
const Schedule = require("../models/Schedule");

const getDashboardData = async (userId) => {
  const [
    totalGoals,
    completedGoals,
    totalTasks,
    completedTasks,
    todaySchedule,
    upcomingDeadlines,
  ] = await Promise.all([
    Goal.countDocuments({ user: userId }),

    Goal.countDocuments({
      user: userId,
      status: "Completed",
    }),

    Task.countDocuments({ user: userId }),

    Task.countDocuments({
      user: userId,
      status: "Completed",
    }),

    Schedule.find({
      user: userId,
      date: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    })
      .populate("task", "title priority")
      .sort({ date: 1 }),

    Goal.find({
      user: userId,
      deadline: { $gte: new Date() },
    })
      .sort({ deadline: 1 })
      .limit(5),
  ]);

  const completionRate =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  return {
    goals: {
      total: totalGoals,
      completed: completedGoals,
      active: totalGoals - completedGoals,
    },

    tasks: {
      total: totalTasks,
      completed: completedTasks,
      pending: totalTasks - completedTasks,
    },

    completionRate,

    todaySchedule,

    upcomingDeadlines,
  };
};

module.exports = {
  getDashboardData,
};