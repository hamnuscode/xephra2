const mongoose = require("mongoose");

const userSubmissionSchema = mongoose.Schema({
  eventId: { type: String, required: true },
  userId: { type: String, required: true },
  gameName: {
    type: String , required: true
  },
  rank: {
    type: Number,
    default: null,
  },
  score: {
    type: Number,
    default: null,
  },
  screenshot: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: 'pending',
  },
});

module.exports = mongoose.model("UserSubmission", userSubmissionSchema);
