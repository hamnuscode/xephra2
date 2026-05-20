// models/Admin.js
const mongoose = require("mongoose");

const AdminProfileSchema = new mongoose.Schema({
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
  locationCity: {
    type: String,
  },
  locationCountry: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
}, { timestamps: true, strict: false });

module.exports = mongoose.model("Profile", AdminProfileSchema,"AdminProfile");
