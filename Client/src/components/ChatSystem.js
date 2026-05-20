import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../redux/features/userSlice";
import { getUserChatGroups } from "../redux/features/ChatsSlice";
import Header from "./ChatSystem/Header";
import ChatArea from "./ChatSystem/ChatArea";
import useSocket from "./ChatSystem/Hooks/useSocket";
import useScrollHandling from "./ChatSystem/Hooks/useScrollHanding";
import Sidebar from "./ChatSystem/Sidebar";

const ChatSystem = ({ inline = false }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);
  const { chatGroups, loading, activeChat, messages, hasMore, oldestMessageTimestamp, messagesLoading } = useSelector((state) => state.chatGroups);
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.UserId;
  
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Track new messages for sidebar indicators
  const [unreadMessages, setUnreadMessages] = useState({});

  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("settings");
    return savedSettings
      ? JSON.parse(savedSettings)
      : { dark: false, isSideMenuOpen: false };
  });

  const toggleSideMenu = () => {
    const newSettings = {
      ...settings,
      isSideMenuOpen: !settings.isSideMenuOpen,
    };
    setSettings(newSettings);
    localStorage.setItem("settings", JSON.stringify(newSettings));
  };

  const toggleTheme = () => {
    const newSettings = { ...settings, dark: !settings.dark };
    setSettings(newSettings);
    localStorage.setItem("settings", JSON.stringify(newSettings));
  };

  // Filter chat groups based on search term
  const filteredChatGroups = chatGroups.filter((group) =>
    group.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Import custom hooks
  const { socketConnected, sendMessage: socketSendMessage } = useSocket({
    userId,
    activeChat,
    setUnreadMessages,
  });

  const { 
    messagesContainerRef, 
    sideMenuRef,
    scrollToBottom, 
    loadMoreMessages,
    handleScroll 
  } = useScrollHandling({
    messages,
    activeChat,
    messagesLoading,
    hasMore,
    oldestMessageTimestamp,
    isLoadingMore,
    setIsLoadingMore
  });

  // Send message handler
    const sendMessage = () => {
      if (!message.trim() || !activeChat || !socketConnected) {
        return;
      }

      const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const now = new Date();
      
      const newMessage = {
        senderId: userId,
        text: message,
        time: {
          timestamp: now,
          weekday: weekdays[now.getDay()],
          hour: now.getHours(),
          minute: now.getMinutes()
        }
      };

      // Use the socketSendMessage function from the hook
      socketSendMessage(activeChat._id, newMessage);
      setMessage(""); // Clear input field
      
      // Scroll to bottom after sending
      setTimeout(() => {
        scrollToBottom();
      }, 200);
    };

    // Fetch profile and chat groups on mount
    useEffect(() => {
      if (userId) {
        dispatch(getProfile(userId));
        dispatch(getUserChatGroups(userId));
      }
    }, [dispatch, userId]);

  // Close side menu when clicking outside
  useEffect(() => {
    const closeSideMenu = (e) => {
      if (sideMenuRef.current && !sideMenuRef.current.contains(e.target)) {
        setSettings((prev) => ({ ...prev, isSideMenuOpen: false }));
      }
    };
    document.addEventListener("mousedown", closeSideMenu);
    return () => document.removeEventListener("mousedown", closeSideMenu);
  }, []);

  if (inline) {
    return (
      <div className="flex h-full" style={{ minHeight: 0 }}>
        <Sidebar
          sideMenuRef={sideMenuRef}
          settings={settings}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredChatGroups={filteredChatGroups}
          activeChat={activeChat}
          loading={loading}
          unreadMessages={unreadMessages}
          handleSelectChat={(group) => {
            const { setActiveChat, fetchMessages, fetchSingleMessages } = require("../redux/features/ChatsSlice");
            if (activeChat && window.socket && socketConnected) {
              window.socket.emit("leaveChat", activeChat._id);
            }
            dispatch(setActiveChat(group));
            if (group.isAdminChat) {
              dispatch(fetchSingleMessages(group._id));
            } else {
              dispatch(fetchMessages(group._id));
            }
            if (unreadMessages[group._id]) {
              setUnreadMessages(prev => ({...prev, [group._id]: 0}));
            }
            if (window.socket && socketConnected) {
              setTimeout(() => {
                window.socket.emit("joinChat", group._id);
              }, 200);
            }
          }}
        />
        <ChatArea
          settings={settings}
          activeChat={activeChat}
          messages={messages}
          messagesContainerRef={messagesContainerRef}
          handleScroll={handleScroll}
          userId={userId}
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          socketConnected={socketConnected}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Background with overlay */}
      <div className="fixed inset-0 z-0">
        <div
          className={`absolute inset-0 ${
            settings.dark
              ? "bg-[url('https://images.ctfassets.net/w5r1fvmogo3f/4UqXpuijA7dp2mMXP2vDtH/ccebdeee7f7853f2b4de8637d31c92cc/ghost_2f2b6b7fdfe84fc4b4778313255fb676.png')]"
              : "bg-[url('https://wallpapercat.com/w/full/f/b/6/1501928-3840x2160-desktop-4k-action-adventure-game-background.jpg')]"
          } bg-cover bg-center`}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <Header
          profile={profile}
          userData={userData}
          settings={settings}
          toggleTheme={toggleTheme}
          toggleSideMenu={toggleSideMenu}
        />

        {/* Main Content */}
        <div className="flex flex-1 space-x-4">
          {/* Sidebar */}
          <Sidebar 
            sideMenuRef={sideMenuRef}
            settings={settings}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredChatGroups={filteredChatGroups}
            activeChat={activeChat}
            loading={loading}
            unreadMessages={unreadMessages}
            handleSelectChat={(group) => {
              const { setActiveChat, fetchMessages, fetchSingleMessages } = require("../redux/features/ChatsSlice");
              
              // First, leave any current chat room
              if (activeChat && window.socket && socketConnected) {
                window.socket.emit("leaveChat", activeChat._id);
              }
              
              dispatch(setActiveChat(group));
              
              // Conditional fetch - different method for admin support chat
              if (group.isAdminChat) {
                console.log(group._id);
                dispatch(fetchSingleMessages(group._id));
              } else {
                dispatch(fetchMessages(group._id));
              }
              
              // Clear unread indicator for this chat
              if (unreadMessages[group._id]) {
                setUnreadMessages(prev => ({...prev, [group._id]: 0}));
              }
              
              // Join the new chat room with a delay to ensure previous actions are completed
              if (window.socket && socketConnected) {
                setTimeout(() => {
                  window.socket.emit("joinChat", group._id);
                  console.log("Joined chat room:", group._id);
                }, 200);
              }
            }}
          />

          {/* Chat Area */}
          <ChatArea 
            settings={settings}
            activeChat={activeChat}
            messages={messages}
            messagesContainerRef={messagesContainerRef}
            handleScroll={handleScroll}
            userId={userId}
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            socketConnected={socketConnected}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatSystem;