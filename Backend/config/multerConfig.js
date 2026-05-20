const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer configurations
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the uploads directory
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Create folder recursively if it doesn't exist
    }
    cb(null, uploadPath); // Set the upload destination
  },
  filename: (req, file, cb) => {
    // Generate a unique name for the uploaded file
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, uniqueName);
  },
});

// File filter configuration
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only image files are allowed!"), false); // Reject the file
  }
};

// Initialize multer with storage and file filter configurations
const upload = multer({ storage, fileFilter });

module.exports = upload;
