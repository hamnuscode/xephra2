import React from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatArea = ({
  settings,
  activeChat,
  messages,
  messagesContainerRef,
  handleScroll,
  userId,
  message,
  setMessage,
  sendMessage,
  socketConnected
}) => {
  return (
    <div
      className={`flex-1 ml-32 pr-4 h-[600px] overflow-hidden ${
        settings?.dark
          ? "bg-[#69363F17] bg-opacity-[.06]"
          : "bg-[##69363F17] bg-opacity-[0.5]"
      } shadow-2xl shadow-gray-950 drop-shadow-[3px_3px_10px_rgba(0,0,0,0.6)] backdrop-blur-sm rounded-lg`}
    >
      {activeChat ? (
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <ChatHeader activeChat={activeChat} />

          {/* Messages */}
          <MessageList 
            messages={messages} 
            messagesContainerRef={messagesContainerRef}
            handleScroll={handleScroll}
            userId={userId}
          />

          {/* Message Input */}
          <MessageInput 
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            socketConnected={socketConnected}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div
              className="text-5xl font-bold mb-4 tracking-widest"
              style={{ fontFamily: "IBM Plex Mono, monospace", color: "#00E5FF", opacity: 0.4 }}
            >
              RIVAL
            </div>
            <p
              className="text-lg font-medium"
              style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}
            >
              Select a chat to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;