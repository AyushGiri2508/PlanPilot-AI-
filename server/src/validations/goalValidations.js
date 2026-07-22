const { body, validationResult } = require("express-validator");

// Handle Validation Errors
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};

// Create Goal Validation
const createGoalValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Goal title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("category")
    .optional()
    .isIn([
      "Career",
      "Study",
      "Fitness",
      "Health",
      "Finance",
      "Personal",
      "Other",
    ])
    .withMessage("Invalid category"),

  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Priority must be Low, Medium or High"),

  body("deadline")
    .notEmpty()
    .withMessage("Deadline is required")
    .isISO8601()
    .withMessage("Invalid date format"),

  validate,
];

// Update Goal Validation
const updateGoalValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("category")
    .optional()
    .isIn([
      "Career",
      "Study",
      "Fitness",
      "Health",
      "Finance",
      "Personal",
      "Other",
    ])
    .withMessage("Invalid category"),

  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Priority must be Low, Medium or High"),

  body("status")
    .optional()
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Invalid status"),

  body("progress")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Progress must be between 0 and 100"),

  body("deadline")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),

  validate,
];

module.exports = {
  createGoalValidation,
  updateGoalValidation,
};