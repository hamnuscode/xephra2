const mongoose = require("mongoose");

const userEventStatsSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  totalEvents: {
    type: Number,
    default: 0,
  },
  averagePoints: {
    type: Number,
    default: 0,
  },
  weightedScore: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("UserEventStats", userEventStatsSchema);
