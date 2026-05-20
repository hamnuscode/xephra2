import React from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import logo from "../../assets/xephra logo-01.png";

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
            <img
              src={logo}
              alt="XEPHRA"
              className="mx-auto mb-4 w-1/3 h-auto"
            />
            <h2
              className="text-4xl font-bold mb-2"
              style={{
                background:
                  "linear-gradient(90deg, #D19F43 4.4%, #B2945C 24.9%, #C9B796 42.9%, #B39867 55.9%, #D5AD66 89%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Select a chat to start messaging
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;