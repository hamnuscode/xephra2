const mongoose = require('mongoose');
const { Schema } = mongoose;

// Subscription Plan Schema
const SubscriptionPlanSchema = new Schema({
  planId: {
    type: String,
    required: [true, 'Plan ID is required'],
    enum: {
      values: ['weekly', 'monthly', 'quarterly'],
      message: 'Plan ID must be weekly, monthly, or quarterly'
    }
  },
  planName: {
    type: String,
    required: [true, 'Plan name is required'],
    enum: {
      values: ['Weekly Plan', 'Monthly Plan', 'Quarterly Plan'],
      message: 'Invalid plan name'
    }
  },
  planPrice: {
    type: String,
    required: [true, 'Plan price is required'],
    enum: {
      values: ['PKR 749', 'PKR 1,499', 'PKR 3,999'],
      message: 'Invalid plan price'
    }
  },
  planDuration: {
    type: String,
    required: [true, 'Plan duration is required'],
    enum: {
      values: ['1 Week', '1 Month', '3 Months'],
      message: 'Invalid plan duration'
    }
  }
}, { _id: false });

// User Details Schema - Enhanced with User Reference
const UserDetailsSchema = new Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    trim: true,
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters'],
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^(\+92|0092|92|0)[0-9]{10}$/, 'Please enter a valid Pakistani phone number']
  }
}, { _id: false });

// Account Details Schema
const AccountDetailsSchema = new Schema({
  bankName: {
    type: String,
    trim: true
  },
  accountNumber: {
    type: String,
    trim: true
  },
  iban: {
    type: String,
    trim: true
  },
  mobileNumber: {
    type: String,
    trim: true
  }
}, { _id: false });

// Payment Details Schema
const PaymentDetailsSchema = new Schema({
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: {
      values: ['askari'],
      message: 'Only Askari Bank is allowed as payment method'
    }
  },
  paymentMethodName: {
    type: String,
    required: [true, 'Payment method name is required'],
    enum: {
      values: ['Askari Bank Transfer'],
      message: 'Only Askari Bank Transfer is allowed as payment method name'
    }
  },
  transactionId: {
    type: String,
    trim: true,
    maxlength: [50, 'Transaction ID cannot exceed 50 characters'],
    required: [true, 'Transaction ID is required']
  },
  accountDetails: AccountDetailsSchema
}, { _id: false });

// Payment Receipt Schema
const PaymentReceiptSchema = new Schema({
  fileName: {
    type: String,
    required: [true, 'File name is required']
  },
  originalFileName: {
    type: String,
    required: [true, 'Original file name is required']
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required'],
    max: [5242880, 'File size cannot exceed 5MB']
  },
  fileType: {
    type: String,
    required: [true, 'File type is required'],
    enum: {
      values: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
      message: 'File type must be JPG, PNG, or PDF'
    }
  },
  filePath: {
    type: String,
    required: [true, 'File path is required']
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// Payment Status Schema - Enhanced with Subscription Tracking
const PaymentStatusSchema = new Schema({
  status: {
    type: String,
    required: [true, 'Payment status is required'],
    enum: {
      values: ['pending', 'verified', 'rejected', 'expired'],
      message: 'Status must be pending, verified, rejected, or expired'
    },
    default: 'pending'
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  verificationDate: {
    type: Date
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to admin user
  },
  rejectionReason: {
    type: String,
    maxlength: 500,
    trim: true
  },
  expiryDate: {
    type: Date
  },
  // Subscription specific fields
  subscriptionStartDate: {
    type: Date
  },
  subscriptionEndDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, { _id: false });

// Main Payment Schema
const PaymentSchema = new Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return `PAY_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    }
  },
  
  selectedPlan: {
    type: SubscriptionPlanSchema,
    required: [true, 'Selected plan is required']
  },
  
  userDetails: {
    type: UserDetailsSchema,
    required: [true, 'User details are required']
  },
  
  paymentDetails: {
    type: PaymentDetailsSchema,
    required: [true, 'Payment details are required']
  },
  
  paymentReceipt: {
    type: PaymentReceiptSchema,
    required: [true, 'Payment receipt is required']
  },
  
  paymentStatus: {
    type: PaymentStatusSchema,
    required: true,
    default: () => ({})
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  collection: 'payments'
});

// Enhanced Indexes for better performance
PaymentSchema.index({ paymentId: 1 }, { unique: true });
PaymentSchema.index({ 'userDetails.userId': 1 }); // New index for user lookup
PaymentSchema.index({ 'userDetails.email': 1 });
PaymentSchema.index({ 'paymentStatus.status': 1 });
PaymentSchema.index({ 'paymentStatus.isActive': 1 }); // New index for active subscriptions
PaymentSchema.index({ 'paymentStatus.submissionDate': -1 });
PaymentSchema.index({ 'selectedPlan.planId': 1 });
PaymentSchema.index({ 'paymentDetails.paymentMethod': 1 });
PaymentSchema.index({ createdAt: -1 });

// Compound index for user subscription queries
PaymentSchema.index({ 
  'userDetails.userId': 1, 
  'paymentStatus.status': 1,
  'paymentStatus.isActive': 1 
});

// Virtual for payment amount as number
PaymentSchema.virtual('paymentAmount').get(function() {
  const priceMap = {
    'PKR 749': 749,
    'PKR 1,499': 1499,
    'PKR 3,999': 3999
  };
  return priceMap[this.selectedPlan.planPrice] || 0;
});

// Virtual for subscription remaining days
PaymentSchema.virtual('remainingDays').get(function() {
  if (!this.paymentStatus.subscriptionEndDate) return 0;
  const now = new Date();
  const endDate = this.paymentStatus.subscriptionEndDate;
  if (now > endDate) return 0;
  const diffTime = endDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to calculate subscription dates
PaymentSchema.pre('save', function(next) {
  if (this.isModified('paymentStatus.status') && this.paymentStatus.status === 'verified') {
    const now = new Date();
    this.paymentStatus.subscriptionStartDate = now;
    this.paymentStatus.isActive = true;
    
    // Calculate end date based on plan
    const durationMap = {
      'weekly': 7,
      'monthly': 30,
      'quarterly': 90
    };
    
    const days = durationMap[this.selectedPlan.planId] || 30;
    this.paymentStatus.subscriptionEndDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
  }
  next();
});

// Instance method to check if subscription is active
PaymentSchema.methods.isSubscriptionActive = function() {
  if (!this.paymentStatus.isActive || this.paymentStatus.status !== 'verified') {
    return false;
  }
  
  if (!this.paymentStatus.subscriptionEndDate) {
    return false;
  }
  
  return new Date() <= this.paymentStatus.subscriptionEndDate;
};

// Static method to find user's active subscription
PaymentSchema.statics.findActiveSubscription = function(userId) {
  return this.findOne({
    'userDetails.userId': userId,
    'paymentStatus.status': 'verified',
    'paymentStatus.isActive': true,
    'paymentStatus.subscriptionEndDate': { $gte: new Date() }
  }).sort({ 'paymentStatus.subscriptionStartDate': -1 });
};

// Static method to find all user payments
PaymentSchema.statics.findUserPayments = function(userId) {
  return this.find({ 'userDetails.userId': userId })
    .sort({ 'paymentStatus.submissionDate': -1 });
};

// Static method to get user subscription status
PaymentSchema.statics.getUserSubscriptionStatus = async function(userId) {
  const activeSubscription = await this.findActiveSubscription(userId);
  
  if (!activeSubscription) {
    return {
      isSubscribed: false,
      subscription: null,
      remainingDays: 0
    };
  }
  
  return {
    isSubscribed: true,
    subscription: activeSubscription,
    remainingDays: activeSubscription.remainingDays,
    plan: activeSubscription.selectedPlan,
    endDate: activeSubscription.paymentStatus.subscriptionEndDate
  };
};

// Create and export the model
const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;