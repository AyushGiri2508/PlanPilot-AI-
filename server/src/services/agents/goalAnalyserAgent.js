const { generateContent } = require("../geminiService");

const analyzeGoal = async (goal) => {
  const prompt = `
You are an expert career and productivity coach.

Analyze the following goal and return ONLY valid JSON.

Goal Title:
${goal.title}

Description:
${goal.description}

Deadline:
${goal.deadline}

Return JSON in exactly this format:

{
  "difficulty": "Easy | Medium | Hard",
  "estimatedDuration": "number of days",
  "dailyHours": number,
  "skills": [],
  "recommendation": ""
}

Do not return markdown.
Do not return explanation.
Return only valid JSON.
`;

  const response = await generateContent(prompt);

  if (!response.success) {
    throw new Error(response.message);
  }

  try {
    return JSON.parse(response.text);
  } catch (error) {
    throw new Error("Invalid JSON returned from Gemini.");
  }
};

module.exports = {
  analyzeGoal,
};