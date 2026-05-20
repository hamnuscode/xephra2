const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Who receives this notification
  recipientId: {
    type: String,
    required: true,
  },
  recipientType: {
    type: String,
    enum: ['user', 'admin'],
    required: true,
  },
  
  // Who sent this notification (can be system generated)
  senderId: {
    type: String,
    default: 'system',
  },
  senderType: {
    type: String,
    enum: ['user', 'admin', 'system'],
    default: 'system',
  },
  
  // Notification content
  type: {
    type: String,
    enum: [
      'subscription_submitted',
      'subscription_approved',
      'subscription_rejected',
      'subscription_edited',
      'subscription_expired',
      'event_created',
      'user_registered_event',
      'event_completed',
      'game_entry_submitted',
      'game_entry_approved',
      'game_entry_rejected',
      'game_entry_edited',
      'game_entry_deleted'
    ],
    required: true,
  },
  
  title: {
    type: String,
    required: true,
  },
  
  message: {
    type: String,
    required: true,
  },
  
  // Related data
  relatedData: {
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserSubmission',
    },
    participantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Participant',
    },
    // Any additional custom data
    extra: {
      type: mongoose.Schema.Types.Mixed,
    }
  },
  
  // Notification status
  isRead: {
    type: Boolean,
    default: false,
  },
  
  readAt: {
    type: Date,
  },
  
  // Priority level
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  
  // Expiry date for notifications
  expiresAt: {
    type: Date,
    default: function() {
      // Default expiry is 30 days from creation
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  }
}, {
  timestamps: true,
});

// Indexes for better performance
notificationSchema.index({ recipientId: 1, recipientType: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to create notification
notificationSchema.statics.createNotification = async function(data) {
  const notification = new this(data);
  return await notification.save();
};

// Instance method to mark as read
notificationSchema.methods.markAsRead = async function() {
  this.isRead = true;
  this.readAt = new Date();
  return await this.save();
};

module.exports = mongoose.model('Notification', notificationSchema);