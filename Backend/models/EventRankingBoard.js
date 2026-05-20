const mongoose = require("mongoose");

const rankingSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: "users",
    required: true,
  },
  rank: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

const eventRankingBoardSchema = new mongoose.Schema({
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events", 
      required: true,
    },
    rankings: [rankingSchema], 
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  });
  

  module.exports = mongoose.model('eventRankingBoard', eventRankingBoardSchema);

