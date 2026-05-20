const Notification = require('../models/Notification');
const Payment = require('../models/Payment');
const Event = require('../models/Events');
const UserSubmission = require('../models/UserSubmission');
const Participant = require('../models/Participant');
const User = require('../models/User');

// Notification service for creating and managing notifications
class NotificationService {
  constructor(io) {
    this.io = io;
  }

  // Generic method to create and emit notification
  async createAndEmitNotification(notificationData) {
    try {
      const notification = await Notification.createNotification(notificationData);
      
      // Emit to specific user/admin
      const roomName = `${notificationData.recipientType}_${notificationData.recipientId}`;
      this.io.to(roomName).emit('newNotification', notification);
      
      // Also emit to general admin room if recipient is admin
      if (notificationData.recipientType === 'admin') {
        this.io.to('admin_dashboard').emit('newNotification', notification);
      }
      
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // 1. User submits subscription (notify admin)
  async notifySubscriptionSubmitted(subscriptionData) {
    const user = await User.findOne({ userId: subscriptionData.userDetails.userId });
    
    return await this.createAndEmitNotification({
      recipientId: 'admin',
      recipientType: 'admin',
      senderId: subscriptionData.userDetails.userId,
      senderType: 'user',
      type: 'subscription_submitted',
      title: 'New Subscription Submitted',
      message: `${user?.name || 'User'} has submitted a new ${subscriptionData.subscriptionPlan.planName} subscription for approval.`,
      relatedData: {
        subscriptionId: subscriptionData._id,
        extra: {
          planName: subscriptionData.subscriptionPlan.planName,
          planPrice: subscriptionData.subscriptionPlan.planPrice,
          userName: user?.name
        }
      },
      priority: 'high'
    });
  }

  // 2. Admin approves subscription (notify user)
  async notifySubscriptionApproved(subscriptionId, userId) {
    const subscription = await Payment.findById(subscriptionId);
    
    return await this.createAndEmitNotification({
      recipientId: userId,
      recipientType: 'user',
      senderId: 'admin',
      senderType: 'admin',
      type: 'subscription_approved',
      title: 'Subscription Approved! 🎉',
      message: `Your ${subscription?.subscriptionPlan?.planName || 'subscription'} has been approved and is now active.`,
      relatedData: {
        subscriptionId: subscriptionId,
        extra: {
          planName: subscription?.subscriptionPlan?.planName,
          endDate: subscription?.paymentStatus?.subscriptionEndDate
        }
      },
      priority: 'high'
    });
  }

  // 3. Admin rejects subscription (notify user)
  async notifySubscriptionRejected(subscriptionId, userId, reason) {
    const subscription = await Payment.findById(subscriptionId);
    
    return await this.createAndEmitNotification({
      recipientId: userId,
      recipientType: 'user',
      senderId: 'admin',
      senderType: 'admin',
      type: 'subscription_rejected',
      title: 'Subscription Rejected',
      message: `Your ${subscription?.subscriptionPlan?.planName || 'subscription'} has been rejected. Reason: ${reason}`,
      relatedData: {
        subscriptionId: subscriptionId,
        extra: {
          planName: subscription?.subscriptionPlan?.planName,
          rejectionReason: reason
        }
      },
      priority: 'high'
    });
  }

  // 4. Admin edits subscription (notify user)
  async notifySubscriptionEdited(subscriptionId, userId, changes) {
    const subscription = await Payment.findById(subscriptionId);
    
    return await this.createAndEmitNotification({
      recipientId: userId,
      recipientType: 'user',
      senderId: 'admin',
      senderType: 'admin',
      type: 'subscription_edited',
      title: 'Subscription Updated',
      message: `Your ${subscription?.subscriptionPlan?.planName || 'subscription'} has been updated by admin.`,
      relatedData: {
        subscriptionId: subscriptionId,
        extra: {
          planName: subscription?.subscriptionPlan?.planName,
          changes: changes
        }
      },
      priority: 'medium'
    });
  }

  // 5. Subscription expired (notify user)
  async notifySubscriptionExpired(subscriptionId, userId) {
    const subscription = await Payment.findById(subscriptionId);
    
    return await this.createAndEmitNotification({
      recipientId: userId,
      recipientType: 'user',
      senderId: 'system',
      senderType: 'system',
      type: 'subscription_expired',
      title: 'Subscription Expired ⚠️',
      message: `Your ${subscription?.subscriptionPlan?.planName || 'subscription'} has expired. Please renew to continue accessing premium features.`,
      relatedData: {
        subscriptionId: subscriptionId,
        extra: {
          planName: subscription?.subscriptionPlan?.planName,
          expiredDate: subscription?.paymentStatus?.subscriptionEndDate
        }
      },
      priority: 'high'
    });
  }

  // 6. Admin creates event (notify all users)
  async notifyEventCreated(eventData, userIds) {
    const notifications = [];
    
    for (const userId of userIds) {
      const notification = await this.createAndEmitNotification({
        recipientId: userId,
        recipientType: 'user',
        senderId: 'admin',
        senderType: 'admin',
        type: 'event_created',
        title: 'New Event Available! 🎮',
        message: `New event "${eventData.title}" for ${eventData.game} is now open for registration!`,
        relatedData: {
          eventId: eventData._id,
          extra: {
            eventTitle: eventData.title,
            game: eventData.game,
            date: eventData.date,
            prizePool: eventData.prizePool
          }
        },
        priority: 'medium'
      });
      notifications.push(notification);
    }
    
    return notifications;
  }

  // 7. User registers for event (notify admin)
  async notifyUserRegisteredEvent(participantData, eventData, userData) {
    return await this.createAndEmitNotification({
      recipientId: 'admin',
      recipientType: 'admin',
      senderId: participantData.userId,
      senderType: 'user',
      type: 'user_registered_event',
      title: 'New Event Registration',
      message: `${userData?.name || 'User'} has registered for event "${eventData?.title || 'Unknown Event'}".`,
      relatedData: {
        eventId: participantData.eventId,
        participantId: participantData._id,
        extra: {
          userName: userData?.name,
          eventTitle: eventData?.title,
          game: eventData?.game
        }
      },
      priority: 'medium'
    });
  }

  // 8. Event completed (notify all participants)
  async notifyEventCompleted(eventData, participantUserIds) {
    const notifications = [];
    
    for (const userId of participantUserIds) {
      const notification = await this.createAndEmitNotification({
        recipientId: userId,
        recipientType: 'user',
        senderId: 'system',
        senderType: 'system',
        type: 'event_completed',
        title: 'Event Completed! 🏆',
        message: `Event "${eventData.title}" has been completed. Check the rankings and results!`,
        relatedData: {
          eventId: eventData._id,
          extra: {
            eventTitle: eventData.title,
            game: eventData.game,
            completedAt: new Date()
          }
        },
        priority: 'medium'
      });
      notifications.push(notification);
    }
    
    return notifications;
  }

  // 9. User submits game entry (notify admin)
  async notifyGameEntrySubmitted(submissionData, userData, eventData) {
    return await this.createAndEmitNotification({
      recipientId: 'admin',
      recipientType: 'admin',
      senderId: submissionData.userId,
      senderType: 'user',
      type: 'game_entry_submitted',
      title: 'New Game Entry Submitted',
      message: `${userData?.name || 'User'} has submitted a game entry for "${eventData?.title || 'Unknown Event'}".`,
      relatedData: {
        submissionId: submissionData._id,
        eventId: submissionData.eventId,
        extra: {
          userName: userData?.name,
          eventTitle: eventData?.title,
          gameName: submissionData.gameName,
          score: submissionData.score,
          rank: submissionData.rank
        }
      },
      priority: 'medium'
    });
  }

  // 10. Admin approves game entry (notify user)
  async notifyGameEntryApproved(submissionId, userId, eventData) {
    return await this.createAndEmitNotification({
      recipientId: userId,
      recipientType: 'user',
      senderId: 'admin',
      senderType: 'admin',
      type: 'game_entry_approved',
      title: 'Game Entry Approved! ✅',
      message: `Your game entry for "${eventData?.title || 'event'}" has been approved and added to rankings.`,
      relatedData: {
        submissionId: submissionId,
        eventId: eventData?._id,
        extra: {
          eventTitle: eventData?.title,
          gameName: eventData?.game
        }
      },
      priority: 'high'
    });
  }

  // 11. Admin rejects game entry (notify user)
  async notifyGameEntryRejected(submissionId, userId, eventData, reason) {
    return await this.createAndEmitNotification({
      recipientId: userId,
      recipientType: 'user',
      senderId: 'admin',
      senderType: 'admin',
      type: 'game_entry_rejected',
      title: 'Game Entry Rejected ❌',
      message: `Your game entry for "${eventData?.title || 'event'}" has been rejected. Reason: ${reason}`,
      relatedData: {
        submissionId: submissionId,
        eventId: eventData?._id,
        extra: {
          eventTitle: eventData?.title,
          gameName: eventData?.game,
          rejectionReason: reason
        }
      },
      priority: 'high'
    });
  }

  // 12. Admin edits game entry (notify user)
  async notifyGameEntryEdited(submissionId, userId, eventData, changes) {
    return await this.createAndEmitNotification({
      recipientId: userId,
      recipientType: 'user',
      senderId: 'admin',
      senderType: 'admin',
      type: 'game_entry_edited',
      title: 'Game Entry Updated',
      message: `Your game entry for "${eventData?.title || 'event'}" has been updated by admin.`,
      relatedData: {
        submissionId: submissionId,
        eventId: eventData?._id,
        extra: {
          eventTitle: eventData?.title,
          gameName: eventData?.game,
          changes: changes
        }
      },
      priority: 'medium'
    });
  }

  // 13. Admin deletes game entry (notify user)
  async notifyGameEntryDeleted(submissionId, userId, eventData, reason) {
    return await this.createAndEmitNotification({
      recipientId: userId,
      recipientType: 'user',
      senderId: 'admin',
      senderType: 'admin',
      type: 'game_entry_deleted',
      title: 'Game Entry Removed',
      message: `Your game entry for "${eventData?.title || 'event'}" has been removed. ${reason ? `Reason: ${reason}` : ''}`,
      relatedData: {
        submissionId: submissionId,
        eventId: eventData?._id,
        extra: {
          eventTitle: eventData?.title,
          gameName: eventData?.game,
          deletionReason: reason
        }
      },
      priority: 'high'
    });
  }
}

// Controller functions
const getNotifications = async (req, res) => {
  try {
    const { userId, userType = 'user', page = 1, limit = 20, unreadOnly = false } = req.query;
    
    const query = {
      recipientId: userId || 'admin', // Use 'admin' as default for admin requests
      recipientType: userType
    };
    
    if (unreadOnly === 'true') {
      query.isRead = false;
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('relatedData.subscriptionId')
      .populate('relatedData.eventId')
      .populate('relatedData.submissionId')
      .populate('relatedData.participantId');

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      recipientId: userId || 'admin',
      recipientType: userType,
      isRead: false
    });

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: notifications.length,
          totalNotifications: total
        },
        unreadCount
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    await notification.markAsRead();
    
    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const { userId, userType = 'user' } = req.body;
    
    await Notification.updateMany(
      {
        recipientId: userId,
        recipientType: userType,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );
    
    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findByIdAndDelete(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const { userId, userType = 'user' } = req.query;
    
    const count = await Notification.countDocuments({
      recipientId: userId,
      recipientType: userType,
      isRead: false
    });
    
    res.json({
      success: true,
      data: { unreadCount: count }
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count',
      error: error.message
    });
  }
};

module.exports = {
  NotificationService,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
};