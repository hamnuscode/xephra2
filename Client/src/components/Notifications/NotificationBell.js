import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';

const NotificationBell = ({ userId, userType = 'user' }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [socket, setSocket] = useState(null);

  // For admin, allow 'admin' as userId or use 'admin' as fallback
  const effectiveUserId = userId || (userType === 'admin' ? 'admin' : null);

  useEffect(() => {
    console.log('NotificationBell props:', { userId, userType, effectiveUserId });
    
    if (!effectiveUserId || effectiveUserId === 'undefined' || effectiveUserId === 'null') {
      console.warn('NotificationBell: No valid userId provided. Props:', { userId, userType, effectiveUserId });
      return;
    }

    console.log('Setting up NotificationBell for userId:', effectiveUserId, 'userType:', userType);

    // Connect to socket with user info
    const backendUrl = process.env.REACT_APP_BACKEND || 'http://localhost:5000';
    const newSocket = io(backendUrl, {
      query: { userId: effectiveUserId, userType },
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      console.log('NotificationBell socket connected');
      newSocket.emit('join', effectiveUserId);
    });

    newSocket.on('disconnect', () => {
      console.log('NotificationBell socket disconnected');
    });

    // Listen for new notifications
    newSocket.on('newNotification', (notification) => {
      console.log('New notification received:', notification);
      setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep only 10 latest
      if (!notification.isRead) {
        setUnreadCount(prev => prev + 1);
      }

      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/logo.png' // Your app logo
        });
      }
    });

    // Listen for notification read status updates
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

    // Fetch initial notifications
    fetchNotifications();

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      console.log('Cleaning up NotificationBell socket');
      newSocket.close();
    };
  }, [effectiveUserId, userType]);

  const fetchNotifications = useCallback(async () => {
    if (!effectiveUserId || effectiveUserId === 'undefined' || effectiveUserId === 'null') {
      console.warn('fetchNotifications: Invalid userId, skipping:', effectiveUserId, 'userType:', userType);
      return;
    }

    try {
      console.log('Fetching notifications for userId:', effectiveUserId, 'userType:', userType);
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND || 'http://localhost:5000';
      
      console.log('Backend URL:', backendUrl);
      console.log('Token exists:', !!token);
      
      const response = await fetch(
        `${backendUrl}/notifications?userId=${effectiveUserId}&userType=${userType}&limit=10`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        // Handle both data structures: data.notifications or data.data.notifications
        const notifications = data.notifications || data.data?.notifications || [];
        setNotifications(notifications);
        const unreadCount = notifications.filter(n => !n.isRead).length;
        setUnreadCount(unreadCount);
        console.log('Notifications loaded:', notifications.length);
      } else {
        console.error('API returned error:', data.message);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, [effectiveUserId, userType]);

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND || 'http://localhost:5000';
      await fetch(`${backendUrl}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      socket?.emit('markNotificationRead', { notificationId, userId, userType });
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND || 'http://localhost:5000';
      await fetch(`${backendUrl}/notifications/mark-all-read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, userType })
      });
      
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      subscription_approved: '✅',
      subscription_rejected: '❌',
      subscription_expired: '⚠️',
      event_created: '🎮',
      user_registered_event: '👤',
      event_completed: '🏆',
      game_entry_submitted: '📝',
      game_entry_approved: '✅',
      game_entry_rejected: '❌',
      default: '🔔'
    };
    return iconMap[type] || iconMap.default;
  };

  return (
    <div className="relative">
      <button 
        className="p-1 text-white rounded-full focus:outline-none hover:bg-gray-400 dark:text-gray-300 dark:hover:bg-gray-700 relative"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Notifications"
      >
        <div className="text-[#C9B796] text-xl">🔔</div>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-12 w-80 bg-[#2a2a2a] rounded-lg shadow-2xl border border-gray-600 z-50 max-h-96 overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-gray-600">
            <h3 className="text-[#D19F43] font-semibold text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                onClick={markAllAsRead}
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <div className="text-4xl mb-2">🔔</div>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification._id}
                  className={`p-3 border-b border-gray-700 hover:bg-[#333] cursor-pointer transition-colors ${
                    !notification.isRead ? 'bg-[#D19F43]/10 border-l-4 border-l-[#D19F43]' : ''
                  }`}
                  onClick={() => !notification.isRead && markAsRead(notification._id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-xl flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm leading-tight mb-1">
                        {notification.title}
                      </h4>
                      <p className="text-gray-300 text-xs leading-relaxed mb-2">
                        {notification.message}
                      </p>
                      <small className="text-gray-500 text-xs">
                        {new Date(notification.createdAt).toLocaleString()}
                      </small>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-[#D19F43] rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-gray-600">
            <button 
              className="w-full text-[#D19F43] hover:text-[#d1a759] text-sm py-2 transition-colors"
              onClick={() => setShowDropdown(false)}
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
