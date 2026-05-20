# 🔔 Xephra Real-Time Notification System

A comprehensive real-time notification system for the Xephra gaming platform that handles all subscription, event, and game entry related notifications.

## 📋 Features

### ✅ Complete Notification Coverage
1. **Subscription Management**
   - User submits subscription → Admin dashboard notification
   - Admin approves subscription → User dashboard notification
   - Admin rejects subscription → User dashboard notification
   - Admin edits subscription → User dashboard notification
   - Subscription expires → User dashboard notification

2. **Event Management**
   - Admin creates event → All users notification
   - User registers for event → Admin dashboard notification
   - Event completed → All participants notification

3. **Game Entry Management**
   - User submits game entry → Admin dashboard notification
   - Admin approves game entry → User dashboard notification
   - Admin rejects game entry → User dashboard notification
   - Admin edits game entry → User dashboard notification
   - Admin deletes game entry → User dashboard notification

### 🔧 Technical Features
- **Real-time delivery** via Socket.IO
- **Persistent storage** in MongoDB
- **Notification priorities** (low, medium, high, urgent)
- **Auto-expiry** (30 days default)
- **Read/unread status** tracking
- **Scheduled notifications** for subscription expiry
- **Background task processing** with node-cron
- **Error handling** with fallback mechanisms

## 🏗️ Architecture

### Models
- **Notification Model** (`models/Notification.js`)
  - Stores all notification data
  - Supports different recipient types (user/admin)
  - Includes priority levels and expiry dates
  - Auto-indexes for performance

### Controllers
- **NotificationController** (`controllers/notificationController.js`)
  - NotificationService class for creating notifications
  - HTTP endpoints for fetching/managing notifications
  - Real-time emission via Socket.IO

### Socket Integration
- **Socket Handler** (`Socket/index.js`)
  - User-specific notification rooms
  - Real-time notification delivery
  - Connection state management

### Scheduled Tasks
- **Notification Scheduler** (`services/notificationScheduler.js`)
  - Checks for expired subscriptions hourly
  - Sends expiry warnings daily
  - Uses node-cron for scheduling

## 🚀 Installation & Setup

### 1. Dependencies (Already Installed)
- `mongoose` - MongoDB ODM
- `socket.io` - Real-time communication
- `node-cron` - Scheduled tasks

### 2. Integration Points

The notification system is automatically integrated into your existing controllers:

#### Payment Controller
```javascript
// After subscription submission
await notifySubscriptionSubmitted(payment);

// After admin approval
await notifySubscriptionApproved(payment._id, payment.userDetails.userId);

// After admin rejection
await notifySubscriptionRejected(payment._id, payment.userDetails.userId, reason);
```

#### Admin Controller
```javascript
// After event creation
await notifyEventCreated(newEvent, userIds);

// After marking event as completed
await notifyEventCompleted(event, participantUserIds);
```

#### User Controller
```javascript
// After user event registration
await notifyUserRegisteredEvent(participant, event, userData);
```

#### Ranking Controller
```javascript
// After user game entry submission
await notifyGameEntrySubmitted(savedSubmission, userData, eventData);

// After admin approval
await notifyGameEntryApproved(submission._id, userId, eventData);

// After admin rejection
await notifyGameEntryRejected(submission._id, userId, eventData, reason);
```

## 🔗 API Endpoints

### Get Notifications
```
GET /notifications?userId={userId}&userType={userType}&page={page}&limit={limit}&unreadOnly={true/false}
```

### Mark Notification as Read
```
PATCH /notifications/{notificationId}/read
```

### Mark All as Read
```
PATCH /notifications/mark-all-read
Body: { userId, userType }
```

### Get Unread Count
```
GET /notifications/unread-count?userId={userId}&userType={userType}
```

### Delete Notification
```
DELETE /notifications/{notificationId}
```

## 🔌 Socket.IO Events

### Client to Server
- `joinNotificationRoom` - Join user-specific notification room
- `leaveNotificationRoom` - Leave notification room
- `markNotificationRead` - Mark notification as read

### Server to Client
- `newNotification` - New notification received
- `notificationMarkedRead` - Notification marked as read
- `adminTypingNotification` - Admin typing indicator

## 💻 Frontend Integration Example

### React Hook for Notifications
```javascript
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export const useNotifications = (userId, userType) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      query: { userId, userType }
    });

    newSocket.on('newNotification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    newSocket.on('notificationMarkedRead', ({ notificationId }) => {
      setNotifications(prev => 
        prev.map(n => 
          n._id === notificationId 
            ? { ...n, isRead: true }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [userId, userType]);

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      socket.emit('markNotificationRead', { notificationId, userId, userType });
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  return { notifications, unreadCount, markAsRead };
};
```

### Notification Component
```javascript
const NotificationBell = ({ userId, userType }) => {
  const { notifications, unreadCount, markAsRead } = useNotifications(userId, userType);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="notification-bell">
      <button onClick={() => setShowDropdown(!showDropdown)}>
        🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>
      
      {showDropdown && (
        <div className="notification-dropdown">
          {notifications.slice(0, 10).map(notification => (
            <div 
              key={notification._id}
              className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
              onClick={() => markAsRead(notification._id)}
            >
              <h4>{notification.title}</h4>
              <p>{notification.message}</p>
              <small>{new Date(notification.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

## 🧪 Testing

### Demo File
A complete demo HTML file is provided (`notification-demo.html`) that shows:
- Real-time connection to the notification system
- Live notification reception
- Notification management (mark as read, etc.)
- All supported notification types

### Manual Testing
1. Start the server: `node server.js`
2. Open `notification-demo.html` in a browser
3. Connect as different user types (user/admin)
4. Trigger actions in your app to see real-time notifications

### Testing Scenarios
1. **Subscription Flow:**
   - User submits subscription → Admin sees notification
   - Admin approves → User sees notification
   - Admin rejects → User sees notification

2. **Event Flow:**
   - Admin creates event → All users see notification
   - User registers → Admin sees notification
   - Admin marks as completed → Participants see notification

3. **Game Entry Flow:**
   - User submits entry → Admin sees notification
   - Admin approves/rejects → User sees notification

## 🔧 Configuration

### Environment Variables
```bash
# MongoDB connection
MONGODB_URI=mongodb://localhost:27017/xephra

# Socket.IO CORS
FRONTEND_URL=http://localhost:3000
```

### Notification Expiry
Default: 30 days. Modify in `models/Notification.js`:
```javascript
expiresAt: {
  type: Date,
  default: function() {
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  }
}
```

### Scheduler Timing
Modify in `services/notificationScheduler.js`:
```javascript
// Check expired subscriptions every hour
cron.schedule('0 * * * *', async () => {
  await this.checkExpiredSubscriptions();
});

// Check expiring subscriptions daily at 9 AM
cron.schedule('0 9 * * *', async () => {
  await this.checkExpiringSubscriptions();
});
```

## 🚀 Deployment Notes

### Production Considerations
1. **Database Indexes**: Automatically created for performance
2. **Socket.IO Scaling**: Consider Redis adapter for multiple servers
3. **Error Handling**: All notification failures are logged but don't break main flows
4. **Performance**: Notification operations are async and non-blocking

### Monitoring
- Monitor notification delivery rates
- Check for failed notification attempts in logs
- Monitor database performance for notification queries

## 🐛 Troubleshooting

### Common Issues
1. **Notifications not received**: Check Socket.IO connection and room joining
2. **Database errors**: Ensure MongoDB is running and indexes are created
3. **Scheduled tasks not running**: Check node-cron configuration
4. **CORS errors**: Update Socket.IO CORS settings

### Debug Mode
Enable detailed logging by setting:
```bash
DEBUG=socket.io:* node server.js
```

## 📝 License
Part of the Xephra gaming platform - All rights reserved.

---
Built with ❤️ for the Xephra gaming community
