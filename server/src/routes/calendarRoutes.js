const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  getSchedule,
  getScheduleByGoal,
  updateScheduleEntry,
} = require("../controllers/calendarController");

router.use(protect);

// GET /api/calendar?startDate=&endDate=
router.get("/", getSchedule);

// GET /api/calendar/goal/:goalId
router.get("/goal/:goalId", getScheduleByGoal);

// PUT /api/calendar/:id
router.put("/:id", updateScheduleEntry);

module.exports = router;
