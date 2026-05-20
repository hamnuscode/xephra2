import React from "react";

const ChatHeader = ({ activeChat }) => {
  return (
    <div
      className="p-4 rounded-t-lg"
      style={{
        background:
          "linear-gradient(92.98deg, #D19F43 12%, #B2945C 31.11%, #C9B796 45.88%, #B39867 64.16%, #D5AD66 81.74%, #D19F43 92.26%)",
      }}
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <span className="text-yellow-600 font-bold">
            {activeChat.name?.[0] || "G"}
          </span>
        </div>
        <div>
          <h2 className="text-[#331A1F] text-3xl drop-shadow-lg font-bold">
            {activeChat.name}
          </h2>
          <p className="text-[#331A1F] drop-shadow-lg text-lg font-semibold">
            {activeChat.users?.length || 0} Members
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;