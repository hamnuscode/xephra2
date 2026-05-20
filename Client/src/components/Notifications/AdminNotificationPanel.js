import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const AdminNotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('AdminNotificationPanel mounted');
    initializeComponent();
    return () => {
      if (socket) {
        console.log('Cleaning up socket connection');
        socket.close();
      }
    };
  }, []);

  const initializeComponent = async () => {
    try {
      // First fetch existing notifications
      await fetchNotifications();
      
      // Then setup socket for real-time updates
      setupSocket();
    } catch (error) {
      console.error('Failed to initialize AdminNotificationPanel:', error);
      setError(error.message);
    }
  };

  const setupSocket = () => {
    const backendUrl = process.env.REACT_APP_BACKEND || 'http://localhost:5000';
    console.log('Setting up socket connection to:', backendUrl);
    
    const newSocket = io(backendUrl, {
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      console.log('Admin socket connected, ID:', newSocket.id);
      // Join admin room
      newSocket.emit('join', 'admin');
    });

    newSocket.on('disconnect', () => {
      console.log('Admin socket disconnected');
    });

    newSocket.on('newNotification', (notification) => {
      console.log('New notification received:', notification);
      if (notification.userType === 'admin') {
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
      
      console.log('Fetching admin notifications...');
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND || 'http://localhost:5000';
      
      console.log('Token exists:', !!token);
      console.log('Backend URL:', backendUrl);
      
      const response = await fetch(
        `${backendUrl}/notifications?userType=admin&limit=50`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setNotifications(data.data.notifications || []);
        setUnreadCount(data.data.unreadCount || 0);
        console.log('Admin notifications loaded:', data.data.notifications?.length || 0);
      } else {
        throw new Error(data.message || 'API returned unsuccessful response');
      }
    } catch (error) {
      console.error('Failed to fetch admin notifications:', error);
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
      console.error('Failed to mark as read:', error);
    }
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      case 'subscription':
        return notifications.filter(n => n.type.includes('subscription'));
      case 'event':
        return notifications.filter(n => n.type.includes('event'));
      case 'game_entry':
        return notifications.filter(n => n.type.includes('game_entry'));
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
        return notifications.filter(n => n.type.includes('subscription')).length;
      case 'event':
        return notifications.filter(n => n.type.includes('event')).length;
      case 'game_entry':
        return notifications.filter(n => n.type.includes('game_entry')).length;
      default:
        return 0;
    }
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      subscription_submitted: '💳',
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
        <h2 className="text-[#D19F43] text-2xl font-bold">🔔 Admin Notifications</h2>
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
                      {notification.priority.toUpperCase()}
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

export default AdminNotificationPanel;
