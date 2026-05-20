const mongoose = require("mongoose");

const chatGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  users: [{ type: String }], // Array to store user IDs
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ChatGroup", chatGroupSchema);