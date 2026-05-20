const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');

// Define User schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google users
    googleId: { type: String, unique: true, sparse: true }, // Google User ID
    userId: { type: String, unique: true, default: () => `user_${Date.now()}` },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isSuspended: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    // Add email verification fields
    isVerified: {
      type: Boolean,
      default: function() {
        // Auto-verify Google users, require verification for password users
        return !!this.googleId;
      }
    },
    verificationToken: String,
    verificationTokenExpires: Date
  },
  { timestamps: true }
);

// Hash password before saving (only for password-based users)
userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};


// Generate verification token method
userSchema.methods.generateVerificationToken = function() {
    // Create a random token
    this.verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Set expiration (24 hours)
    // this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

    // Set expiration (5 minutes)
    this.verificationTokenExpires = Date.now() + 5 * 60 * 1000;

    // Set expiration (1 hour)
    // this.verificationTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    
    return this.verificationToken;
};


// Check if user needs email verification
userSchema.methods.needsVerification = function() {
  // Google users don't need email verification
  // Password users need verification unless already verified
  return !this.googleId && !this.isVerified;
};

// Check if verification token is valid
userSchema.methods.isVerificationTokenValid = function(token) {
  return this.verificationToken === token && 
         this.verificationTokenExpires > Date.now();
};

// Clear verification token after successful verification
userSchema.methods.clearVerificationToken = function() {
  this.verificationToken = undefined;
  this.verificationTokenExpires = undefined;
  this.isVerified = true;
};

const User = mongoose.model("User", userSchema);
module.exports = User;