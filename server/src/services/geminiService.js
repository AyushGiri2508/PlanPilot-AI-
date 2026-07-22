const ai = require("../config/gemini");

const generateContent = async (prompt, options = {}) => {
  try {
    const model = options.model || "gemini-2.5-flash";

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return {
      success: true,
      text: response.text,
    };
  } catch (error) {
    console.error("Gemini Error:", error);

    return {
      success: false,
      message: error.message || "Failed to generate AI response",
    };
  }
};

module.exports = {
  generateContent,
};