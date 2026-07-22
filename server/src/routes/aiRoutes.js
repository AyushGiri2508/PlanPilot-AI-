const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  generatePlan,
  regeneratePlan,
  recoverPlan,
} = require("../controllers/aicontroller");

// Protect all AI routes
router.use(protect);

// Generate AI Plan
router.post(
  "/goals/:goalId/generate-plan",
  generatePlan
);

// Regenerate AI Plan
router.post(
  "/goals/:goalId/regenerate-plan",
  regeneratePlan
);

// Recover Plan
router.post(
  "/goals/:goalId/recover",
  recoverPlan
);

module.exports = router;