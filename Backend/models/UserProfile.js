const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema({
  profileImage: {
    type: String,
    default: "",
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  age: {
    type: Number,
    required: true,
  },
  locationCity: {
    type: String,
  },
  locationCountry: {
    type: String,
  },
  favoriteGames: {
    type: [String],
    default: [],
  },
}, { timestamps: true, strict: false });

module.exports = mongoose.model("UserProfile", UserProfileSchema, "UserProfile");
