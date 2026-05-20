const mongoose = require("mongoose");

const AdminMessageSchema = new mongoose.Schema({
   chatGroupId: {
      type: mongoose.Schema.Types.ObjectId, // Store as ObjectId
      required: true,
    }, // Reference to AdminChatGroup
    senderId: {
        type: String,
        ref: "User", // Reference to User
        required: true,
      }, // Can be userId or adminId
  text: { 
    type: String,
    required: true
 },
  time: {
    timestamp: { type: Date, required: true }, // Store full date and time
    weekday: { type: String, required: true }, // Ensure weekday name is stored
    hour: { type: Number, required: true },
    minute: { type: Number, required: true },
  },
});

module.exports = mongoose.model("AdminMessage", AdminMessageSchema);
