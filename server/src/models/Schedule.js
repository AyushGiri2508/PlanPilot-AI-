const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    goal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      required: true,
      index: true,
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    plannedHours: {
      type: Number,
      required: true,
      min: 0.5,
    },

    completedHours: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Missed"],
      default: "Pending",
    },

    completedAt: {
      type: Date,
      default: null,
    },

    aiGenerated: {
      type: Boolean,
      default: true,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate schedule entries for the same task on the same date
scheduleSchema.index({ task: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Schedule", scheduleSchema);