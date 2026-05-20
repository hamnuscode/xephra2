const nodemailer = require('nodemailer');
require("dotenv").config();

// Gmail SMTP Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail service
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS  // Your Gmail app password
  },
  tls: {
    rejectUnauthorized: false // Prevents TLS certificate error
  }
});

// Test the connection (optional)
transporter.verify((error, success) => {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

module.exports = { transporter };
