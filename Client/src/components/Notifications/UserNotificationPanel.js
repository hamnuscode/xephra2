import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const UserNotificationPanel = ({ dark }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.user);

  // Get effective userId
  const effectiveUserId = user?._id || profile?.userId || profile?._id;

  useEffect(() => {
    console.log('UserNotificationPanel mounted for userId:', effectiveUserId);
    if (effectiveUserId) {
      initializeComponent();
    } else {
      console.warn('No userId available for UserNotificationPanel');
      setLoading(false);
      setError('User not authenticated');
    }
    
    return () => {
      if (socket) {
        console.log('Cleaning up socket connection');
        socket.close();
      }
    };
  }, [effectiveUserId]);

  const initializeComponent = async () => {
    try {
      // First fetch existing notifications
      await fetchNotifications();
      
      // Then setup socket for real-time updates
      setupSocket();
    } catch (error) {
      console.error('Failed to initialize UserNotificationPanel:', error);
      setError(error.message);
    }
  };

  const setupSocket = () => {
    const backendUrl = process.env.REACT_APP_BACKEND || 'http://localhost:5000';
    console.log('Setting up socket connection to:', backendUrl);
    
    const newSocket = io(backendUrl, {
      query: { userId: effectiveUserId, userType: 'user' },
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      console.log('User socket connected, ID:', newSocket.id);
      // Join user room
      newSocket.emit('join', effectiveUserId);
    });

    newSocket.on('disconnect', () => {
      console.log('User socket disconnected');
    });

    newSocket.on('newNotification', (notification) => {
      console.log('New notification received:', notification);
      if (notification.recipientId === effectiveUserId && notification.recipientType === 'user') {
        setNotifications(prev => [notification, ...prev]);
        if (!notification.isRead) {
          setUnreadCount(prev => prev + 1);
        }
      }
    });

    setSocket(newSocket);
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching user notifications for userId:', effectiveUserId);
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND || 'http://localhost:5000';
      
      console.log('Token exists:', !!token);
      console.log('Backend URL:', backendUrl);
      
      const response = await fetch(
        `${backendUrl}/notifications?userId=${effectiveUserId}&userType=user&limit=50`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('User notifications API response:', data);
      
      if (data.success) {
        const notifications = data.notifications || data.data?.notifications || [];
        setNotifications(notifications);
        const unreadCount = notifications.filter(n => !n.isRead).length;
        setUnreadCount(unreadCount);
        console.log(`Loaded ${notifications.length} user notifications, ${unreadCount} unread`);
      } else {
        throw new Error(data.message || 'Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND || 'http://localhost:5000';
      
      const response = await fetch(`${backendUrl}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => 
            n._id === notificationId 
              ? { ...n, isRead: true }
              : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      case 'subscription':
        return notifications.filter(n => n.type?.includes('subscription'));
      case 'event':
        return notifications.filter(n => n.type?.includes('event'));
      case 'game_entry':
        return notifications.filter(n => n.type?.includes('game_entry') || n.type?.includes('ranking'));
      default:
        return notifications;
    }
  };

  const getFilterCount = (filterType) => {
    switch (filterType) {
      case 'all':
        return notifications.length;
      case 'unread':
        return unreadCount;
      case 'subscription':
        return notifications.filter(n => n.type?.includes('subscription')).length;
      case 'event':
        return notifications.filter(n => n.type?.includes('event')).length;
      case 'game_entry':
        return notifications.filter(n => n.type?.includes('game_entry') || n.type?.includes('ranking')).length;
      default:
        return 0;
    }
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      subscription_approved: '✅',
      subscription_rejected: '❌',
      subscription_expired: '⚠️',
      event_posted: '🎮',
      event_completed: '🏆',
      game_entry_approved: '✅',
      game_entry_rejected: '❌',
      game_entry_edited: '📝',
      ranking_approved: '🏆',
      ranking_rejected: '❌',
      default: '🔔'
    };
    return iconMap[type] || iconMap.default;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#D19F43';
      case 'low': return '#5352ed';
      default: return '#D19F43';
    }
  };

  const filteredNotifications = getFilteredNotifications();

  if (loading) {
    return (
      <div className="bg-[#2a2a2a] rounded-xl p-6 my-5 shadow-2xl">
        <div className="text-center py-16 text-gray-400">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#2a2a2a] rounded-xl p-6 my-5 shadow-2xl">
      {/* Main Panel */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-600">
        <h2 className="text-[#D19F43] text-2xl font-bold">🔔 My Notifications</h2>
        <div className="flex items-center gap-4">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {unreadCount} Unread
          </span>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-5">
        {['all', 'unread', 'subscription', 'event', 'game_entry'].map(filterType => (
          <button
            key={filterType}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-300 capitalize ${
              filter === filterType
                ? 'bg-[#D19F43] text-black font-bold'
                : 'bg-transparent border border-gray-600 text-gray-300 hover:border-[#D19F43] hover:text-[#D19F43]'
            }`}
            onClick={() => setFilter(filterType)}
          >
            {filterType} ({getFilterCount(filterType)})
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="max-h-[600px] overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl">No notifications found</p>
            <p className="text-sm mt-2">
              Filter: {filter} | Total: {notifications.length}
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification._id}
              className={`flex items-start bg-[#333] rounded-lg mb-3 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden ${
                !notification.isRead ? 'bg-[#D19F43]/10 border border-[#D19F43]/30' : ''
              }`}
              onClick={() => !notification.isRead && markAsRead(notification._id)}
            >
              <div
                className="w-1 h-full absolute left-0 top-0"
                style={{ backgroundColor: getPriorityColor(notification.priority) }}
              ></div>

              <div className="text-3xl p-4 ml-2">
                {getNotificationIcon(notification.type)}
              </div>

              <div className="flex-1 p-4 pr-0 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-semibold text-lg leading-tight">
                    {notification.title}
                  </h3>
                  <div className="flex flex-col items-end gap-1 ml-4">
                    <span
                      className="text-xs font-bold px-2 py-1 rounded bg-white/10"
                      style={{ color: getPriorityColor(notification.priority) }}
                    >
                      {notification.priority?.toUpperCase() || 'MEDIUM'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="text-gray-300 mb-3 leading-relaxed">
                  {notification.message}
                </p>

                {notification.relatedData?.extra && (
                  <div className="flex flex-wrap gap-3 mb-3">
                    {Object.entries(notification.relatedData.extra).map(([key, value]) => (
                      <span key={key} className="bg-white/5 px-2 py-1 rounded text-xs text-gray-300">
                        <span className="text-[#D19F43] font-semibold">{key}:</span> {value}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {!notification.isRead && (
                <div className="w-3 h-3 bg-[#D19F43] rounded-full m-4 shadow-lg shadow-[#D19F43]/50"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserNotificationPanel;
