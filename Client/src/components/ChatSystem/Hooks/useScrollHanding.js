import { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchOlderMessages } from "../../../redux/features/ChatsSlice";

const useScrollHandling = ({
  messages,
  activeChat,
  messagesLoading,
  hasMore,
  oldestMessageTimestamp,
  isLoadingMore,
  setIsLoadingMore
}) => {
  const dispatch = useDispatch();
  const messagesContainerRef = useRef(null);
  const sideMenuRef = useRef(null);
  const [previousChatId, setPreviousChatId] = useState(null);
  const shouldScrollToBottom = useRef(true);
  
  // Improved scroll to bottom function
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const scrollHeight = messagesContainerRef.current.scrollHeight;
      messagesContainerRef.current.scrollTop = scrollHeight;
    }
  };

  // Check if user is near bottom of chat
  const isNearBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return false;
    
    return container.scrollHeight - container.scrollTop - container.clientHeight < 100;
  };

  // Load older messages
  const loadMoreMessages = () => {
    if (activeChat && !messagesLoading && hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      dispatch(fetchOlderMessages({
        chatGroupId: activeChat._id,
        before: oldestMessageTimestamp
      })).finally(() => setIsLoadingMore(false));
    }
  };

  // Handle scroll to load more messages
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop } = messagesContainerRef.current;
      
      // If user scrolls manually, don't auto-scroll on next messages update
      // unless they're already near the bottom
      shouldScrollToBottom.current = isNearBottom();
      
      // Load more messages when user scrolls near the top
      if (scrollTop < 5 && !messagesLoading && hasMore && !isLoadingMore) {
        loadMoreMessages();
      }
    }
  };

  // Track active chat changes
  useEffect(() => {
    if (activeChat && activeChat._id !== previousChatId) {
      // New chat selected, ensure we scroll to bottom when messages load
      shouldScrollToBottom.current = true;
      setPreviousChatId(activeChat._id);
    }
  }, [activeChat, previousChatId]);

  // Handle scrolling based on message changes
  useEffect(() => {
    // Only proceed if we have messages and a valid container
    if (messages.length > 0 && messagesContainerRef.current) {
      if (shouldScrollToBottom.current && !isLoadingMore) {
        // Add a slight delay to ensure DOM has updated with new messages
        setTimeout(() => {
          scrollToBottom();
        }, 300);
      }
    }
  }, [messages, isLoadingMore]);

  // Handle scrolling after loading is complete
  useEffect(() => {
    if (!messagesLoading && messages.length > 0 && shouldScrollToBottom.current) {
      setTimeout(scrollToBottom, 300);
    }
  }, [messagesLoading, messages.length]);

  return {
    messagesContainerRef,
    sideMenuRef,
    scrollToBottom,
    loadMoreMessages,
    handleScroll,
    isNearBottom
  };
};

export default useScrollHandling;