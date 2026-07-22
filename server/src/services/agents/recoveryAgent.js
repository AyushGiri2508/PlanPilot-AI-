const { generateContent } = require("../geminiService");

const recoverSchedule = async (
  goal,
  pendingTasks,
  completedTasks,
  availableHoursPerDay = 3
) => {
  const prompt = `
You are an intelligent productivity coach.

The user has fallen behind schedule.

Goal:
${goal.title}

Deadline:
${goal.deadline}

Available Hours Per Day:
${availableHoursPerDay}

Completed Tasks:
${JSON.stringify(completedTasks, null, 2)}

Pending Tasks:
${JSON.stringify(pendingTasks, null, 2)}

Create a new realistic schedule.

Rules:

1. Keep completed tasks unchanged.
2. Reschedule only pending tasks.
3. Finish before deadline.
4. Don't exceed available hours/day.
5. Preserve task dependencies.
6. Return ONLY valid JSON.

Expected format:

[
  {
    "date":"YYYY-MM-DD",
    "tasks":[
      {
        "taskId":"",
        "title":"",
        "hours":2
      }
    ]
  }
]

No markdown.

No explanation.
`;

  const response = await generateContent(prompt);

  if (!response.success) {
    throw new Error(response.message);
  }

  try {
    const cleaned = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    throw new Error("Invalid JSON returned from Gemini.");
  }
};

module.exports = {
  recoverSchedule,
};