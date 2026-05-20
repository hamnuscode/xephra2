const mongoose = require("mongoose");

const AdminchatGroupSchema = new mongoose.Schema({
  chatGroupId: { type: String, unique: true },
  userId: {  type: String },
  adminId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AdminChatGroup", AdminchatGroupSchema);