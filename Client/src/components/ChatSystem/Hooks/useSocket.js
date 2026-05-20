import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useDispatch } from "react-redux";
import { addMessage } from "../../../redux/features/ChatsSlice";
const apiUrl = process.env.REACT_APP_BACKEND;

const useSocket = ({ userId, activeChat, setUnreadMessages }) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const dispatch = useDispatch();
  const socket = useRef(null);
  
  // Keep socket instance available to window for external usage
  useEffect(() => {
    if (socket.current) {
      window.socket = socket.current;
    }
  }, [socket.current]);
  
  // Socket setup and message handling
  useEffect(() => {
    if (!userId) return; // Don't connect if no user ID
    
    // Create socket connection with improved options
    socket.current = io(apiUrl, {
      query: { userId }, // Identify user on connection
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    transports: ["websocket", "polling"]  
    });
    
    // Make socket available to window for external components
    window.socket = socket.current;
    
    socket.current.on("connect", () => {
      console.log("Socket connected:", socket.current.id);
      setSocketConnected(true);
      
      // Join active chat room if one is selected
      if (activeChat) {
        socket.current.emit("joinChat", activeChat._id);
        console.log("Joined chat on connect:", activeChat._id);
      }
    });

    socket.current.on("receiveMessage", (data) => {
      console.log("Received message:", data);
      
      // Force a re-render by updating the Redux state
      dispatch(addMessage(data));
      
      // Update unread message counter for this chat group
      if (activeChat?._id !== data.chatGroupId) {
        setUnreadMessages(prev => ({
          ...prev, 
          [data.chatGroupId]: (prev[data.chatGroupId] || 0) + 1
        }));
      }
    });

    // Handle confirmation of joining a chat room
    socket.current.on("joinedChat", (data) => {
      console.log("Successfully joined chat room:", data.chatGroupId);
    });

    socket.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setSocketConnected(false);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [dispatch, userId]);

  // Separate effect to handle joining rooms when activeChat changes
  useEffect(() => {
    if (socket.current && socketConnected && activeChat) {
      socket.current.emit("joinChat", activeChat._id);
      console.log("Joined chat room on activeChat change:", activeChat._id);
    }
  }, [activeChat, socketConnected]);

  // Function to send a message
  const sendMessage = (chatGroupId, newMessage) => {
    if (socket.current && socketConnected) {
      console.log(chatGroupId);
      socket.current.emit("sendMessage", {
        chatGroupId,
        message: newMessage,
      });
    }
  };
  
  return { socketConnected, sendMessage };
};

export default useSocket;