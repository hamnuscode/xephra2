// Time formatting utilities

export const formatTime = (time) => {
    if (!time) return "";
    return `${time.hour}:${time.minute.toString().padStart(2, "0")}`;
  };