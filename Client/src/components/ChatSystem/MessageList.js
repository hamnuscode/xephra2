import React from "react";
import { formatTime } from "./formatTime";

const MessageList = ({ messages, messagesContainerRef, handleScroll, userId }) => {
  console.log(messages);
  // Helper to format message time for sorting
  const getMessageTime = (msg) => {
    if (!msg.time?.timestamp) return 0;
    return new Date(msg.time.timestamp).getTime(); // Get exact timestamp
  };
  
  const sortedMessages = [...messages].sort((a, b) => {
    return getMessageTime(a) - getMessageTime(b);
  });

  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(600px-150px)]"
      onScroll={handleScroll}
    >
      {sortedMessages.length === 0 ? (
        <div className="text-center text-white p-4">
          No messages yet. Start the conversation!
        </div>
      ) : (
        sortedMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.senderId === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-md p-3 rounded-lg ${
                msg.senderId === userId ? "bg-[#D4AD66]" : "bg-[#C9B796]"
              }`}
            >
              <p className="text-[#69363F] text-sm font-semibold mb-1">
                {msg.senderId === userId ? msg?.username : msg.sender?.name || msg?.username}
              </p>
              <p className="text-[#1b1b1b]">{msg.text}</p>
              <p className="text-[#000000] text-xs mt-1">
                {msg.time?.weekday}, {formatTime(msg.time)}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MessageList;