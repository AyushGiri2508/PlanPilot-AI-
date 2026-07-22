const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const {
  registerValidation,
  loginValidation,
} = require("../validations/authValidation");

// Public Routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

// Protected Routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;