const Goal = require("../models/Goal");
const User = require("../models/User");
const Task = require("../models/Task");
const Schedule = require("../models/Schedule");

const { analyzeGoal } = require("./agents/goalAnalyserAgent");
const { generateTasks } = require("./agents/taskGeneratorAgent");
const { prioritizeTasks } = require("./agents/priorityAgent");
const { scheduleTasks } = require("./agents/schedulerAgent");

const runWorkflow = async (goalId) => {
  const goal = await Goal.findById(goalId);

  if (!goal) {
    throw new Error("Goal not found.");
  }

  // Fetch user's daily available hours
  const user = await User.findById(goal.user);
  const dailyHours = user?.dailyAvailableHours || 3;

  // 1. Analyze Goal
  const analysis = await analyzeGoal(goal);

  // 2. Generate Tasks
  const generatedTasks = await generateTasks(goal, analysis);

  // 3. Save Tasks
  const insertedTasks = await Task.insertMany(
    generatedTasks.map((task) => ({
      ...task,
      goal: goal._id,
      user: goal.user,
      aiGenerated: true,
    }))
  );

  // 4. Prioritize Tasks
  const priorities = await prioritizeTasks(goal, insertedTasks);

  // Update priorities by matching on title (since AI returns titles, not ObjectIds)
  if (Array.isArray(priorities)) {
    const bulkOps = [];

    for (const item of priorities) {
      const matchingTask = insertedTasks.find(
        (t) => t.title.toLowerCase().trim() === item.title.toLowerCase().trim()
      );

      if (matchingTask && item.priority) {
        bulkOps.push({
          updateOne: {
            filter: { _id: matchingTask._id },
            update: {
              $set: {
                priority: item.priority,
              },
            },
          },
        });
      }
    }

    if (bulkOps.length > 0) {
      await Task.bulkWrite(bulkOps);
    }
  }

  // Fetch updated tasks
  const updatedTasks = await Task.find({ goal: goal._id });

  // 5. Generate Schedule (pass user's daily available hours)
  const schedule = await scheduleTasks(goal, updatedTasks, dailyHours);

  // 6. Save Schedule
  const scheduleDocuments = [];

  schedule.forEach((day) => {
    day.tasks.forEach((task) => {
      scheduleDocuments.push({
        user: goal.user,
        goal: goal._id,
        task: task.taskId,
        date: new Date(day.date),
        plannedHours: task.hours,
      });
    });
  });

  if (scheduleDocuments.length > 0) {
    await Schedule.insertMany(scheduleDocuments);
  }

  // 7. Update goal status to "In Progress"
  if (goal.status === "Pending") {
    goal.status = "In Progress";
    await goal.save();
  }

  return {
    analysis,
    tasks: updatedTasks,
    schedule,
  };
};

module.exports = {
  runWorkflow,
};