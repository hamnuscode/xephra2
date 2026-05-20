import React from "react";
import { TiAttachment } from "react-icons/ti";

const MessageInput = ({ message, setMessage, sendMessage, socketConnected }) => {
  return (
    <div className="p-4">
      <div className="flex items-center space-x-2 relative">
        {/* <TiAttachment className="text-white absolute left-4 text-2xl" /> */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-[#333333D4] text-white px-4 pl-9 py-3 rounded-full focus:outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-[#D19F43] p-3 rounded-full"
          disabled={!socketConnected}
        >
          <span className="px-2">Send</span>
        </button>
      </div>
    </div>
  );
};

export default MessageInput;