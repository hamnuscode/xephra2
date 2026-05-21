const { Server } = require("socket.io");
const MessageModel = require("../models/Message");
const AdminChatGroupModel = require("../models/AdminChatGroup");
const AdminMessageModel = require("../models/AdminMessage");
const { NotificationService } = require("../controllers/notificationController");

const socketSetup = (server) => {
  const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ["websocket", "polling"]
  });

  // Initialize notification service with socket.io instance
  const notificationService = new NotificationService(io);

  // Keep track of online users and their socket connections
  const activeUsers = new Map(); // userId -> online status
  const userSockets = new Map(); // socketId -> userId
  const adminSockets = new Set(); // Set of admin socket IDs

  io.on("connection", (socket) => {
    // Store user information if provided in the query
    const userId = socket.handshake.query.userId;
    const userType = socket.handshake.query.userType || 'user';
    
    if (userId) {
      activeUsers.set(userId, true);
      userSockets.set(socket.id, { userId, userType });
      
      // Join user-specific room for notifications
      const userRoom = `${userType}_${userId}`;
      socket.join(userRoom);
      
      // If admin, also join general admin dashboard room
      if (userType === 'admin') {
        socket.join('admin_dashboard');
        adminSockets.add(socket.id);
      }
    }

    // Handle sending messages
    socket.on("sendMessage" , async ({ chatGroupId, message }) => {
      try {
        let savedMessage;
        
    
        // Check if the chat group belongs to an admin
        const isAdminChat = await AdminChatGroupModel.exists({ _id: chatGroupId });
    
        if (isAdminChat) {
         
          const newMessage = new AdminMessageModel({
            chatGroupId,
            senderId: message.senderId,
            text: message.text,
            time: message.time,
          });
          savedMessage = await newMessage.save();
        } else {
          const newMessage = new MessageModel({
            chatGroupId,
            senderId: message.senderId,
            text: message.text,
            time: message.time,
          });
          savedMessage = await newMessage.save();
        }
    
        // Broadcast message
        const messageToSend = { ...message, chatGroupId, _id: savedMessage._id };
        io.to(chatGroupId).emit("receiveMessage", messageToSend);
      } catch (error) {
        console.error("Error handling message:", error);
        socket.emit("messageError", { error: "Failed to save message" });
      }
    });

    // Handle joining chat groups - with confirmation
    socket.on("joinChat", (chatGroupId) => {
      if (!chatGroupId) {
        console.error("Invalid chatGroupId");
        return;
      }
      
      // Join the new chat room
      socket.join(chatGroupId);
      
      
      // Confirm to the client that they joined
      socket.emit("joinedChat", { chatGroupId });
    });
    
    // Handle leaving chat groups
    socket.on("leaveChat", (chatGroupId) => {
      if (chatGroupId) {
        socket.leave(chatGroupId);
       
      }
    });

    // Handle notification-related events
    socket.on("joinNotificationRoom", ({ userId, userType }) => {
      const roomName = `${userType}_${userId}`;
      socket.join(roomName);
    });

    socket.on("leaveNotificationRoom", ({ userId, userType }) => {
      const roomName = `${userType}_${userId}`;
      socket.leave(roomName);
    });

    // Handle marking notification as read in real-time
    socket.on("markNotificationRead", ({ notificationId, userId, userType }) => {
      // Broadcast to all user's connected devices
      const roomName = `${userType}_${userId}`;
      socket.to(roomName).emit("notificationMarkedRead", { notificationId });
    });

    // Handle real-time typing indicators for notifications
    socket.on("adminTypingNotification", ({ recipientId }) => {
      const roomName = `user_${recipientId}`;
      socket.to(roomName).emit("adminTypingNotification", { 
        isTyping: true,
        timestamp: new Date()
      });
    });

    socket.on("adminStoppedTypingNotification", ({ recipientId }) => {
      const roomName = `user_${recipientId}`;
      socket.to(roomName).emit("adminTypingNotification", { 
        isTyping: false,
        timestamp: new Date()
      });
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      // Clean up when user disconnects
      if (userSockets.has(socket.id)) {
        const { userId, userType } = userSockets.get(socket.id);
        activeUsers.delete(userId);
        userSockets.delete(socket.id);
        
        // Remove from admin sockets if was admin
        if (userType === 'admin') {
          adminSockets.delete(socket.id);
        }
      }
    });
  });

  // Attach notification service to io instance for external access
  io.notificationService = notificationService;

  return io;
};

module.exports = socketSetup;

module.exports = socketSetup;