const Payment = require("../models/Payment");
const path = require("path");
const fs = require("fs").promises;
const { 
  notifySubscriptionSubmitted,
  notifySubscriptionApproved,
  notifySubscriptionRejected,
  notifySubscriptionEdited
} = require("../utils/notificationHelpers");

const paymentController = {
  createPayment: async (req, res) => {
    try {
      const { userDetails, selectedPlan, paymentDetails } = req.body;

      if (!userDetails || !selectedPlan || !paymentDetails || !req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields: userDetails, selectedPlan, paymentDetails, or payment receipt",
        });
      }

      // Check if user ID is provided
      if (!userDetails.userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required in userDetails",
        });
      }

      // Check if user already has an existing payment/subscription using userId
      const existingPayment = await Payment.findOne({
        "userDetails.userId": userDetails.userId,
        "paymentStatus.status": { $in: ["pending", "verified"] },
      }).sort({ "paymentStatus.submissionDate": -1 });

      if (existingPayment) {
        const status = existingPayment.paymentStatus.status;

        if (status === "pending") {
          return res.status(409).json({
            success: false,
            message:
              "You already have a payment request pending. Please wait for verification.",
            data: {
              paymentId: existingPayment.paymentId,
              status: status,
              submissionDate: existingPayment.paymentStatus.submissionDate,
            },
          });
        }

        if (status === "verified") {
          return res.status(409).json({
            success: false,
            message: "Your subscription is already verified and active.",
            data: {
              paymentId: existingPayment.paymentId,
              status: status,
              submissionDate: existingPayment.paymentStatus.submissionDate,
              expiryDate: existingPayment.paymentStatus.expiryDate,
            },
          });
        }
      }

      const paymentReceipt = {
        fileName: req.file.filename,
        originalFileName: req.file.originalname,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        filePath: req.file.path,
        uploadDate: new Date(),
      };

      const payment = new Payment({
        userDetails,
        selectedPlan,
        paymentDetails,
        paymentReceipt,
      });

      await payment.save();

      // Send notification to admin about new subscription submission
      await notifySubscriptionSubmitted(payment);

      res.status(201).json({
        success: true,
        message: "Payment submitted successfully",
        data: {
          paymentId: payment.paymentId,
          status: payment.paymentStatus.status,
          submissionDate: payment.paymentStatus.submissionDate,
          expiryDate: payment.paymentStatus.expiryDate,
        },
      });
    } catch (error) {
      console.error("Create Payment Error:", error);
      if (req.file) await fs.unlink(req.file.path).catch(console.error);
      res.status(500).json({
        success: false,
        message: "Failed to create payment",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  getAllPayments: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        planId,
        paymentMethod,
        startDate,
        endDate,
        search, // User name ya email search karne ke liye
        sortBy = "submissionDate",
        sortOrder = "desc",
      } = req.query;

      // Input validation
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(Math.max(1, parseInt(limit)), 100); // Max 100 records

      // Build filter object
      const filter = {};

      if (status) {
        // Multiple status filter support
        const statuses = Array.isArray(status) ? status : [status];
        filter["paymentStatus.status"] = { $in: statuses };
      }

      if (planId) filter["selectedPlan.planId"] = planId;
      if (paymentMethod) filter["paymentDetails.paymentMethod"] = paymentMethod;

      // Date range filter
      if (startDate || endDate) {
        filter["paymentStatus.submissionDate"] = {};
        if (startDate) {
          const start = new Date(startDate);
          if (isNaN(start.getTime())) {
            return res.status(400).json({
              success: false,
              message: "Invalid start date format",
            });
          }
          filter["paymentStatus.submissionDate"].$gte = start;
        }
        if (endDate) {
          const end = new Date(endDate);
          if (isNaN(end.getTime())) {
            return res.status(400).json({
              success: false,
              message: "Invalid end date format",
            });
          }
          // End date ko end of day set karenge
          end.setHours(23, 59, 59, 999);
          filter["paymentStatus.submissionDate"].$lte = end;
        }
      }

      // Search functionality
      if (search) {
        filter.$or = [
          { "userDetails.name": { $regex: search, $options: "i" } },
          { "userDetails.email": { $regex: search, $options: "i" } },
          { "paymentDetails.transactionId": { $regex: search, $options: "i" } },
        ];
      }

      // Sort options
      const sortOptions = {};
      const validSortFields = ["submissionDate", "amount", "status"];
      const sortField = validSortFields.includes(sortBy)
        ? sortBy
        : "submissionDate";
      const sortDirection = sortOrder === "asc" ? 1 : -1;

      if (sortField === "submissionDate") {
        sortOptions["paymentStatus.submissionDate"] = sortDirection;
      } else if (sortField === "amount") {
        sortOptions["selectedPlan.price"] = sortDirection;
      } else if (sortField === "status") {
        sortOptions["paymentStatus.status"] = sortDirection;
      }

      const skip = (pageNum - 1) * limitNum;

      // Parallel execution for better performance
      const [payments, totalCount] = await Promise.all([
        Payment.find(filter)
          .sort(sortOptions)
          .skip(skip)
          .limit(limitNum)
          .populate("paymentStatus.verifiedBy", "name email")
          .populate("userDetails.userId", "name email") // User details bhi populate karenge
          .lean(), // Better performance ke liye
        Payment.countDocuments(filter),
      ]);

      // Response with additional metadata
      const totalPages = Math.ceil(totalCount / limitNum);

      res.status(200).json({
        success: true,
        data: {
          payments,
          pagination: {
            currentPage: pageNum,
            totalPages,
            totalCount,
            limit: limitNum,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1,
          },
          filters: {
            status,
            planId,
            paymentMethod,
            startDate,
            endDate,
            search,
          },
          sort: {
            sortBy: sortField,
            sortOrder,
          },
        },
      });
    } catch (error) {
      console.error("Get All Payments Error:", error);

      // Specific error handling
      if (error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "Invalid ID format provided",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to fetch payments",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },


// (18 July 2025)
updatePaymentById: async (req, res) => {
  try {
    const { paymentId } = req.params;
    if (!paymentId || paymentId.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing payment ID",
      });
    }

    const payment = await Payment.findOne({ paymentId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    const updateData = req.body;

    // Step 1: Update userDetails
    if (updateData.userDetails) {
      const { fullName, email, phoneNumber } = updateData.userDetails;
      if (fullName) payment.userDetails.fullName = fullName;
      if (email) payment.userDetails.email = email;
      if (phoneNumber) payment.userDetails.phoneNumber = phoneNumber;
    }

    // Step 2: Update paymentDetails
    if (updateData.paymentDetails) {
      const { paymentMethod, transactionId } = updateData.paymentDetails;
      if (paymentMethod) {
        if (paymentMethod !== 'askari') {
          return res.status(400).json({
            success: false,
            message: 'Only Askari Bank is accepted as payment method.'
          });
        }
        payment.paymentDetails.paymentMethod = 'askari';
        payment.paymentDetails.paymentMethodName = 'Askari Bank Transfer';
      }
      if (transactionId) {
        payment.paymentDetails.transactionId = transactionId;
      }
    }

    // Step 3: Update selectedPlan
    let planChanged = false;
    if (updateData.selectedPlan?.planId) {
      const planId = updateData.selectedPlan.planId;
      const planMap = {
        weekly: {
          planName: "Weekly Plan",
          planPrice: "PKR 749",
          planDuration: "1 Week",
        },
        monthly: {
          planName: "Monthly Plan",
          planPrice: "PKR 1,499",
          planDuration: "1 Month",
        },
        quarterly: {
          planName: "Quarterly Plan",
          planPrice: "PKR 3,999",
          planDuration: "3 Months",
        },
      };
      const plan = planMap[planId];

      if (!plan) {
        return res.status(400).json({
          success: false,
          message: "Invalid planId",
        });
      }

      payment.selectedPlan.planId = planId;
      payment.selectedPlan.planName = plan.planName;
      payment.selectedPlan.planPrice = plan.planPrice;
      payment.selectedPlan.planDuration = plan.planDuration;
      planChanged = true;
    }

    // Step 4: Update paymentStatus (NEW SECTION)
    if (updateData.paymentStatus) {
      const { rejectionReason } = updateData.paymentStatus;
      
      // Update rejection reason if provided
      if (rejectionReason !== undefined) {
        // Allow empty string to clear the rejection reason
        payment.paymentStatus.rejectionReason = rejectionReason;
      }
      
      // Optional: Add validation for rejected payments
      if (payment.paymentStatus.status === "rejected" && 
          (!rejectionReason || rejectionReason.trim() === "")) {
        return res.status(400).json({
          success: false,
          message: "Rejection reason is required for rejected payments",
        });
      }
    }

    // Step 5: If plan changed and status is verified, recalculate dates
    if (planChanged && payment.paymentStatus.status === "verified") {
      const now = new Date();
      let subscriptionStartDate = new Date(now);
      let subscriptionEndDate = new Date(now);

      switch (payment.selectedPlan.planId) {
        case "weekly":
          subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 7);
          break;
        case "monthly":
          subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
          break;
        case "quarterly":
          subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 3);
          break;
      }

      payment.paymentStatus.subscriptionStartDate = subscriptionStartDate;
      payment.paymentStatus.subscriptionEndDate = subscriptionEndDate;
      payment.paymentStatus.expiryDate = new Date(subscriptionEndDate);
      payment.paymentStatus.isActive = true;
    }

    await payment.save();

    res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      data: payment,
    });

  } catch (error) {
    console.error("Update Payment Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update payment",
      error: error.message, // Show real error during testing
    });
  }
},

  verifyPayment: async (req, res) => {
    try {
      const { paymentId } = req.params;
      const adminId = req.user?.id;

      const payment = await Payment.findOne({ paymentId });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      if (payment.paymentStatus.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: `Payment is already ${payment.paymentStatus.status}`,
        });
      }

      // Subscription duration logic
      const now = new Date();
      let subscriptionStartDate = new Date(now);
      let subscriptionEndDate = new Date(now);

      const planType = payment.selectedPlan?.planId; // 'weekly', 'monthly', 'yearly'

      switch (planType) {
        case "weekly":
          subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 7);
          break;
        case "monthly":
          subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
          break;
        case "yearly":
          subscriptionEndDate.setFullYear(
            subscriptionEndDate.getFullYear() + 1
          );
          break;
        default:
          subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
          break;
      }

      // Expiry Date = same as subscription end date (or +1 day grace)
      const expiryDate = new Date(subscriptionEndDate); // OR add 1 day: new Date(subscriptionEndDate.getTime() + 86400000)

      // Update payment status
      payment.paymentStatus = {
        ...payment.paymentStatus,
        status: "verified",
        verificationDate: now,
        verifiedBy: adminId,
        subscriptionStartDate,
        subscriptionEndDate,
        expiryDate,
        isActive: true,
      };

      await payment.save();

      // Send notification to user about subscription approval
      await notifySubscriptionApproved(payment._id, payment.userDetails.userId);

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: payment.paymentStatus,
      });
    } catch (error) {
      console.error("Verify Payment Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to verify payment",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // rejectPayment: async (req, res) => {
  //   try {
  //     const { paymentId } = req.params;
  //     const adminId = req.user?.id;

  //     const payment = await Payment.findOne({ paymentId });

  //     if (!payment) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "Payment not found",
  //       });
  //     }

  //     if (payment.paymentStatus.status !== "pending") {
  //       return res.status(400).json({
  //         success: false,
  //         message: `Payment is already ${payment.paymentStatus.status}`,
  //       });
  //     }

  //     // Update payment status to rejected
  //     payment.paymentStatus = {
  //       ...payment.paymentStatus,
  //       status: "rejected",
  //       verificationDate: new Date(),
  //       verifiedBy: adminId,
  //     };

  //     await payment.save();

  //     res.status(200).json({
  //       success: true,
  //       message: "Payment rejected successfully",
  //       data: payment.paymentStatus,
  //     });
  //   } catch (error) {
  //     console.error("Reject Payment Error:", error);
  //     res.status(500).json({
  //       success: false,
  //       message: "Failed to reject payment",
  //       error:
  //         process.env.NODE_ENV === "development"
  //           ? error.message
  //           : "Internal server error",
  //     });
  //   }
  // },


  rejectPayment: async (req, res) => {
    try {
      const { paymentId } = req.params;
      const { rejectionReason } = req.body; // Get rejection reason from request body
      const adminId = req.user?.id;

      // Validate rejection reason
      if (!rejectionReason || !rejectionReason.trim()) {
        return res.status(400).json({
          success: false,
          message: "Rejection reason is required",
        });
      }

      // Validate rejection reason length
      if (rejectionReason.trim().length > 500) {
        return res.status(400).json({
          success: false,
          message: "Rejection reason must be less than 500 characters",
        });
      }

      const payment = await Payment.findOne({ paymentId });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      if (payment.paymentStatus.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: `Payment is already ${payment.paymentStatus.status}`,
        });
      }

      // Update payment status to rejected with reason
      payment.paymentStatus = {
        ...payment.paymentStatus,
        status: "rejected",
        verificationDate: new Date(),
        verifiedBy: adminId,
        rejectionReason: rejectionReason.trim(), // Store the rejection reason
      };

      await payment.save();

      // Send notification to user about subscription rejection
      await notifySubscriptionRejected(payment._id, payment.userDetails.userId, rejectionReason.trim());

      res.status(200).json({
        success: true,
        message: "Payment rejected successfully",
        data: {
          paymentId: payment.paymentId,
          status: payment.paymentStatus.status,
          rejectionReason: payment.paymentStatus.rejectionReason,
          verificationDate: payment.paymentStatus.verificationDate,
          verifiedBy: payment.paymentStatus.verifiedBy,
        },
      });
    } catch (error) {
      console.error("Reject Payment Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to reject payment",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  getPaymentById: async (req, res) => {
    try {
      const payment = await Payment.findOne({
        paymentId: req.params.paymentId,
      }).populate("paymentStatus.verifiedBy", "name email");
      if (!payment)
        return res
          .status(404)
          .json({ success: false, message: "Payment not found" });
      res.status(200).json({ success: true, data: payment });
    } catch (error) {
      console.error("Get Payment By ID Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch payment",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

getUserSubscriptions: async (req, res) => {
  const { userId } = req.params;

  try {
    // Add basic validation
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const subscriptions = await Payment.find({ "userDetails.userId": userId }).lean();

    // Return early if no subscriptions found
    if (!subscriptions || subscriptions.length === 0) {
      return res.json({
        active: [],
        expired: [],
        pending: [],
        rejected: [],
        total: 0
      });
    }

    // Use reduce for more efficient categorization
    const categorized = subscriptions.reduce((acc, sub) => {
      const status = sub.paymentStatus?.status;
      const isActive = sub.paymentStatus?.isActive;

      // Handle potential missing paymentStatus
      if (!status) {
        acc.pending.push(sub);
        return acc;
      }

      if (status === 'verified' && isActive) {
        acc.active.push(sub);
      } else if (status === 'expired') {
        acc.expired.push(sub);
      } else if (status === 'pending') {
        acc.pending.push(sub);
      } else if (status === 'rejected') {
        acc.rejected.push(sub);
      }

      return acc;
    }, {
      active: [],
      expired: [],
      pending: [],
      rejected: []
    });

    // Return structured response instead of flattened array
    res.json({
      ...categorized,
      total: subscriptions.length
    });

  } catch (err) {
    console.error('Error fetching user subscriptions:', err);
    res.status(500).json({ 
      message: 'Failed to fetch subscriptions',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
},


// PUT update a pending subscription
updatePendingSubscription: async (req, res) => {
  const { userId, subscriptionId } = req.params;
  const updatedFields = req.body;

  try {
    const subscription = await Payment.findOne({ _id: subscriptionId, userId });

    if (!subscription || subscription.paymentStatus.status !== 'pending') {
      return res.status(404).json({ message: 'Pending subscription not found' });
    }

    // Update selectedPlan or other fields as needed
    Object.assign(subscription.selectedPlan, updatedFields.selectedPlan || {});
    subscription.paymentStatus.updatedAt = Date.now(); // optional

    await subscription.save();
    res.json({ message: 'Subscription updated', subscription });
  } catch (err) {
    console.error('Error updating subscription:', err);
    res.status(500).json({ message: 'Error updating pending subscription' });
  }
},


// DELETE a pending subscription using paymentId
  deletePendingSubscriptionByPaymentId: async (req, res) => {
    const { paymentId } = req.params;
    const userId = req.user.UserId;

    try {
      const subscription = await Payment.findOne({
        paymentId,
        userId,
        'paymentStatus.status': 'pending',
      });

      if (!subscription) {
        return res.status(404).json({ message: 'Pending subscription not found' });
      }

      await Payment.deleteOne({ paymentId });
      res.json({ message: 'Subscription deleted successfully' });
    } catch (err) {
      console.error('Error deleting subscription:', err);
      res.status(500).json({ message: 'Error deleting pending subscription' });
    }
  },

  getSubscriptionStatus: async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Checking subscription status for userId:', userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Find any subscription that is verified and active for this user
    const subscription = await Payment.findOne({
      'userDetails.userId': userId,
      'paymentStatus.status': 'verified',
      'paymentStatus.isActive': true
    }).sort({ 'paymentStatus.submissionDate': -1 });

    console.log('Subscription found for user:', !!subscription);
    
    if (subscription) {
      console.log('User has active subscription');
      return res.status(200).json({
        success: true,
        isVerified: true,
        isActive: true,
        message: "User has a verified and active subscription"
      });
    } else {
      console.log('User does not have active subscription');
      return res.status(200).json({
        success: true,
        isVerified: false,
        isActive: false,
        message: "User does not have a verified and active subscription"
      });
    }

  } catch (error) {
    console.error('Subscription status check error:', error);
    return res.status(500).json({
      success: false,
      message: "Server error while checking subscription status"
    });
  }
},

  // Validate team members' subscription status
  validateTeamSubscriptions: async (req, res) => {
    try {
      const { xephraIds } = req.body;
      console.log('Validating subscriptions for Xephra IDs:', xephraIds);

      if (!xephraIds || !Array.isArray(xephraIds) || xephraIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Xephra IDs array is required and cannot be empty"
        });
      }

      // Check subscription status for all members using XephraId
      const subscriptionChecks = await Promise.all(
        xephraIds.map(async (xephraId) => {
          console.log(`Checking subscription for Xephra ID: ${xephraId}`);
          
          // Find the user with this XephraId (which is actually userId)
          const User = require('../models/User');
          const user = await User.findOne({ 
            userId: xephraId.trim()
          });

          if (!user) {
            console.log(`User not found for Xephra ID: ${xephraId}`);
            return {
              xephraId: xephraId.trim(),
              hasActiveSubscription: false,
              error: 'User not found'
            };
          }

          console.log(`User found: ${user.userId}, checking subscription...`);

          // Check subscription using the user's userId
          const subscription = await Payment.findOne({
            'userDetails.userId': user.userId,
            'paymentStatus.status': 'verified',
            'paymentStatus.isActive': true
          }).sort({ 'paymentStatus.submissionDate': -1 });

          console.log(`Subscription found for ${user.userId}:`, !!subscription);

          return {
            xephraId: xephraId.trim(),
            userId: user.userId,
            hasActiveSubscription: !!subscription
          };
        })
      );

      // Find members without active subscriptions
      const inactiveMembers = subscriptionChecks
        .filter(check => !check.hasActiveSubscription)
        .map(check => check.xephraId);

      console.log('Subscription check results:', subscriptionChecks);
      console.log('Inactive members:', inactiveMembers);

      if (inactiveMembers.length > 0) {
        console.log('Some members have inactive subscriptions, returning error');
        return res.status(400).json({
          success: false,
          message: `Some team members don't have active subscriptions`,
          inactiveMembers: inactiveMembers,
          allChecks: subscriptionChecks
        });
      }

      console.log('All members have active subscriptions');
      return res.status(200).json({
        success: true,
        message: "All team members have active subscriptions",
        allChecks: subscriptionChecks
      });

    } catch (error) {
      console.error('Team subscription validation error:', error);
      return res.status(500).json({
        success: false,
        message: "Server error while validating team subscriptions"
      });
    }
  },

  getPendingPayments: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const [payments, totalCount] = await Promise.all([
        Payment.find({ "paymentStatus.status": "pending" })
          .sort({ "paymentStatus.submissionDate": -1 })
          .skip(Number(skip))
          .limit(Number(limit)),
        Payment.countDocuments({ "paymentStatus.status": "pending" }),
      ]);

      res.status(200).json({
        success: true,
        data: {
          payments,
          pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
          },
        },
      });
    } catch (error) {
      console.error("Get Pending Payments Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch pending payments",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  updatePaymentNotes: async (req, res) => {
    try {
      const { paymentId } = req.params;
      const { notes } = req.body;

      const payment = await Payment.findOneAndUpdate(
        { paymentId },
        { "paymentStatus.notes": notes },
        { new: true }
      );

      if (!payment)
        return res
          .status(404)
          .json({ success: false, message: "Payment not found" });
      res.status(200).json({
        success: true,
        message: "Payment notes updated successfully",
        data: { paymentId: payment.paymentId, notes },
      });
    } catch (error) {
      console.error("Update Payment Notes Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update payment notes",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  downloadReceipt: async (req, res) => {
    try {
      const payment = await Payment.findOne({
        paymentId: req.params.paymentId,
      });
      if (!payment)
        return res
          .status(404)
          .json({ success: false, message: "Payment not found" });

      const filePath = payment.paymentReceipt.filePath;
      try {
        await fs.access(filePath);
        res.download(filePath, payment.paymentReceipt.originalFileName);
      } catch {
        res
          .status(404)
          .json({ success: false, message: "Receipt file not found" });
      }
    } catch (error) {
      console.error("Download Receipt Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to download receipt",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // Add this function to your paymentController object, before the closing brace

  getPaymentStats: async (req, res) => {
    try {
      const stats = await Payment.aggregate([
        {
          $group: {
            _id: null,
            totalPayments: { $sum: 1 },
            pendingCount: {
              $sum: {
                $cond: [{ $eq: ["$paymentStatus.status", "pending"] }, 1, 0],
              },
            },
            verifiedCount: {
              $sum: {
                $cond: [{ $eq: ["$paymentStatus.status", "verified"] }, 1, 0],
              },
            },
            rejectedCount: {
              $sum: {
                $cond: [{ $eq: ["$paymentStatus.status", "rejected"] }, 1, 0],
              },
            },
            totalRevenue: {
              $sum: {
                $cond: [
                  { $eq: ["$paymentStatus.status", "verified"] },
                  "$selectedPlan.price",
                  0,
                ],
              },
            },
          },
        },
      ]);

      // Get monthly stats for the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const monthlyStats = await Payment.aggregate([
        {
          $match: {
            "paymentStatus.submissionDate": { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$paymentStatus.submissionDate" },
              month: { $month: "$paymentStatus.submissionDate" },
            },
            count: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [
                  { $eq: ["$paymentStatus.status", "verified"] },
                  "$selectedPlan.price",
                  0,
                ],
              },
            },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ]);

      // Get plan popularity
      const planStats = await Payment.aggregate([
        {
          $group: {
            _id: "$selectedPlan.planId",
            planName: { $first: "$selectedPlan.planName" },
            count: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [
                  { $eq: ["$paymentStatus.status", "verified"] },
                  "$selectedPlan.price",
                  0,
                ],
              },
            },
          },
        },
        {
          $sort: { count: -1 },
        },
      ]);

      const result = {
        overview: stats[0] || {
          totalPayments: 0,
          pendingCount: 0,
          verifiedCount: 0,
          rejectedCount: 0,
          totalRevenue: 0,
        },
        monthlyStats,
        planStats,
      };

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Get Payment Stats Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch payment statistics",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },
};

module.exports = paymentController;
