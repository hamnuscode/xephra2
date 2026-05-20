const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  teamData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeamData",
    required: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

participantSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model("Participant", participantSchema);
