// utils/subscriptionCron.js
const cron = require('node-cron');
const Payment = require('../models/Payment'); // Adjust path based on your project
const mongoose = require('mongoose');

const updateExpiredSubscriptions = async () => {
  try {
    const now = new Date();

    const result = await Payment.updateMany(
      {
        'paymentStatus.status': 'verified',
        'paymentStatus.expiryDate': { $lt: now }
      },
      {
        $set: {
          'paymentStatus.status': 'expired',
          'paymentStatus.isActive': false
        }
      }
    );
  } catch (err) {
    console.error('[Cron] Failed to update subscriptions:', err.message);
  }
};

// Run every night at 12:00 AM
const startSubscriptionCron = () => {
  cron.schedule('0 0 * * *', () => {
    updateExpiredSubscriptions();
  });
};

module.exports = startSubscriptionCron;
