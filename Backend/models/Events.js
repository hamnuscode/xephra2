const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  game: { type: String, required: true },
  gameMode: { type: String, required: true, enum: ['solo', 'duo', 'squad'] },
  date: { type: String, required: true },
  time: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // Store the file path or URL
  prizePool: { type: Number, required: true,min: 0 },
  rules: { type: String, required: true },
  hosted: { type: Boolean, required: true,default: false },
  chatGroupId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatGroup", required: true }, // Link to chat group
},{ timestamps: true, strict: false });

module.exports = mongoose.model("Event", EventSchema);
