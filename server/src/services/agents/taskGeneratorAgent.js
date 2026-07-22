const { generateContent } = require("../geminiService");

const generateTasks = async (goal, analysis) => {
  const prompt = `
You are an expert project planner.

Create a detailed roadmap for the following goal.

Goal Title:
${goal.title}

Description:
${goal.description}

Deadline:
${goal.deadline}

Difficulty:
${analysis.difficulty}

Estimated Duration:
${analysis.estimatedDuration}

Recommended Daily Hours:
${analysis.dailyHours}

Required Skills:
${analysis.skills.join(", ")}

Generate between 10 and 30 actionable tasks.

Each task must contain:

[
  {
    "title": "",
    "description": "",
    "priority": "Low | Medium | High",
    "estimatedHours": number
  }
]

Rules:
- Return ONLY valid JSON array.
- No markdown.
- No explanation.
- Tasks should follow logical order.
- Split large work into smaller tasks.
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
  generateTasks,
};