const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const AdminChatGroup = require("../models/AdminChatGroup")
const { transporter } = require("../config/emailConfig");

const generateToken = (user) => {
  return jwt.sign(
    {
      UserId: user.UserId,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d", // 1 day expiry
    }
  );
};

// Send verification email function using Gmail SMTP
const sendVerificationEmail = async (user, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'https://xephra.net'}/verify-email/${verificationToken}`;
  
  const mailOptions = {
    from: `"Xephra" <${process.env.EMAIL_USER}>`, // sender address
    to: user.email, // recipient
    subject: 'Verify Your Email Address - Xephra',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Xephra!</h2>
        <p>Hi ${user.name},</p>
        <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
        <p><strong>Note:</strong> This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated email, please do not reply.</p>
      </div>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${user.email} via Gmail SMTP`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};


exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
    });

    // Generate verification token
    const verificationToken = newUser.generateVerificationToken();

    const savedUser = await newUser.save();

    // Send verification email
    try {
      await sendVerificationEmail(savedUser, verificationToken);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Continue with user creation even if email fails
    }
    
    // Find an admin user to create a chat group with
    const admin = await User.findOne({ role: "admin" });
    
    if (admin) {
      // Generate a unique chat group ID
      const chatGroupId = `chat_${savedUser._id}_${admin._id}_${Date.now()}`;
      
      // Create a new admin chat group
      const newAdminChatGroup = new AdminChatGroup({
        chatGroupId,
        userId: savedUser.userId.toString(),
        adminId: admin.userId.toString(),
      });
      
      await newAdminChatGroup.save();
    }
    
    const token = generateToken(savedUser);

    res.status(201).json({
      // message: "User created successfully",
      message: "User created successfully. Please check your email to verify your account.",
      token,
      user: {
        name: savedUser.name,
        UserId: savedUser.UserId || savedUser._id, // Ensure UserId is available
        email: savedUser.email,
        role: savedUser.role,
        isVerified: savedUser.isVerified,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.Login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Check if user needs email verification
    if (user.needsVerification()) {
      return res.status(400).json({ 
        error: "Please verify your email address before logging in",
        needsVerification: true
      });
    }

    // Check if user is suspended
    if (user.isSuspended) {
      return res.status(403).json({ error: "Your account has been suspended" });
    }

    const comparePassword = await user.comparePassword(password);
    if (!comparePassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);

    // Store JWT in HTTP-only cookies
    res.cookie("token", token, {
      httpOnly: true, // Prevents access from JavaScript
      secure: true,  // Set to true if using HTTPS
      sameSite: "None", // Required for cross-origin cookies
  });
  
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        UserId: user.userId,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Email verification endpoint
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  
  if (!token) {
    return res.status(400).json({ error: "Verification token is required" });
  }

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        error: "Invalid or expired verification token" 
      });
    }

    // Clear verification token and mark as verified
    user.clearVerificationToken();
    await user.save();

    res.status(200).json({
      message: "Email verified successfully! You can now log in.",
      success: true
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Resend verification email
exports.resendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "Email is already verified" });
    }

    // Generate new verification token
    const verificationToken = user.generateVerificationToken();
    await user.save();

    // Send verification email
    await sendVerificationEmail(user, verificationToken);

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully"
    });
  } catch (error) {
    console.error("Resend verification email error:", error);
    res.status(500).json({ error: "Failed to send verification email" });
  }
};


  exports.forgot = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Email not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const tokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = tokenExpiry;
    await user.save();

    // const resetUrl = `http://localhost:3000/reset/${resetToken}`;
    // Or for production:
    const resetUrl = `${process.env.FRONTEND_URL}/reset/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Xephra",
      text: `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending password reset email." });
  }
};


exports.reset = async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.params;

  if (!newPassword) {
    return res.status(400).json({ error: "Password is required" });
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password." });
  }
};
