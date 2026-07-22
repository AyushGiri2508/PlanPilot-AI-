const { generateContent } = require("../geminiService");

const prioritizeTasks = async (goal, tasks) => {
  const prompt = `
You are an AI productivity assistant.

Analyze the following goal and task list.

Goal:
${goal.title}

Deadline:
${goal.deadline}

Tasks:

${JSON.stringify(tasks, null, 2)}

For every task decide the priority.

Priority must be one of:

High
Medium
Low

Return ONLY valid JSON.

Example:

[
  {
    "title":"Learn React",
    "priority":"High"
  }
]

Do not return explanation.
Do not return markdown.
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
  prioritizeTasks,
};