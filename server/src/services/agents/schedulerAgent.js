const { generateContent } = require("../geminiService");

const scheduleTasks = async (goal, tasks, availableHoursPerDay = 3) => {
  const prompt = `
You are an AI scheduling assistant.

Create a realistic day-wise study/work schedule.

Goal:
${goal.title}

Goal Deadline:
${goal.deadline}

Available Hours Per Day:
${availableHoursPerDay}

Tasks:
${JSON.stringify(tasks, null, 2)}

Rules:

1. Don't exceed daily available hours.
2. Finish before the deadline.
3. Keep task order logical.
4. Break long tasks across multiple days if needed.
5. Include taskId from the input in every scheduled item.
6. Return ONLY valid JSON.

Expected JSON format:

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
  scheduleTasks,
};