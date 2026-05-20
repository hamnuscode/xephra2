const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PaymentController = require('../controllers/paymentController'); // Adjust path as needed

const router = express.Router();

// =======================
// Ensure uploads/receipts directory exists
// =======================
const uploadDir = path.join(__dirname, '..', 'uploads', 'receipts');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// =======================
// Multer configuration for file uploads
// =======================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `receipt-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and PDF files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});


const parseJSONFields = (req, res, next) => {
  const jsonFields = ['userDetails', 'selectedPlan', 'paymentDetails'];
  
  jsonFields.forEach(field => {
    if (req.body[field] && typeof req.body[field] === 'string') {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: `Invalid JSON in ${field}`,
          error: error.message
        });
      }
    }
  });
  next();
};

// =======================
// Middleware imports
// =======================
const { authenticateUser, authenticateAdmin } = require('../middleware/authMiddleware'); // Adjust path as needed
const { validatePayment } = require('../middleware/validatePayment'); // Adjust path as needed

// =======================
// PUBLIC ROUTES
// =======================

// Create new payment submission
router.post(
  '/submit',
  upload.single('paymentReceipt'),
  parseJSONFields,
  PaymentController.createPayment
);

// Get payment by ID (for user to check their payment status)
router.get('/payment/:paymentId', PaymentController.getPaymentById);

// =======================
// USER AUTHENTICATED ROUTES
// =======================

// GET all categorized subscriptions for a user
router.get('/user/:userId/subscriptions', authenticateUser, PaymentController.getUserSubscriptions);

// UPDATE a pending subscription
router.put('/user/:userId/subscriptions/pending/:subscriptionId', authenticateUser, PaymentController.updatePendingSubscription);

// DELETE pending subscription using paymentId
router.delete(
  '/subscriptions/pending/by-payment-id/:paymentId',
  authenticateUser,
  PaymentController.deletePendingSubscriptionByPaymentId
);

// Get user's subscription status
router.get('/user/:userId/subscription-status', authenticateUser, PaymentController.getSubscriptionStatus);

// Validate team members' subscription status
router.post('/validate-team-subscriptions', PaymentController.validateTeamSubscriptions);

// =======================
// ADMIN AUTHENTICATED ROUTES
// =======================

// Get all payments (Admin only)
router.get('/admin/all', authenticateAdmin, PaymentController.getAllPayments);

// Update payment (Admin only)
router.patch('/admin/:paymentId/update', authenticateAdmin, PaymentController.updatePaymentById);

// Verify payment (Admin only)
router.patch('/admin/:paymentId/verify', authenticateAdmin, PaymentController.verifyPayment);

// Reject payment (Admin only)
router.patch('/admin/:paymentId/reject', authenticateAdmin, PaymentController.rejectPayment);

// Get pending payments (Admin only)
router.get('/admin/pending', authenticateAdmin, PaymentController.getPendingPayments);

// Get payment statistics (Admin only)
router.get('/admin/stats', authenticateAdmin, PaymentController.getPaymentStats);

// Update payment notes (Admin only)
router.patch('/admin/:paymentId/notes', authenticateAdmin, PaymentController.updatePaymentNotes);

// Download any payment receipt (Admin only)
router.get('/admin/receipt/:paymentId/download', authenticateAdmin, PaymentController.downloadReceipt);

// =======================
// ERROR HANDLING MIDDLEWARE
// =======================
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size allowed is 5MB.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field. Only "paymentReceipt" field is allowed.'
      });
    }
  }

  if (error.message === 'Invalid file type. Only JPG, PNG, and PDF files are allowed.') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next(error);
});

module.exports = router;
