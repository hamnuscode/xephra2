const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} = require('../controllers/notificationController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Get notifications for a user/admin
// Query params: userId, userType (user/admin), page, limit, unreadOnly
router.get('/', authenticateUser, getNotifications);

// Get unread notification count
router.get('/unread-count', authenticateUser, getUnreadCount);

// Mark specific notification as read
router.patch('/:notificationId/read', authenticateUser, markAsRead);

// Mark all notifications as read for a user
router.patch('/mark-all-read', authenticateUser, markAllAsRead);

// Delete a notification
router.delete('/:notificationId', authenticateUser, deleteNotification);

module.exports = router;