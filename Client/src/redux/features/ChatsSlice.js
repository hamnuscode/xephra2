import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_BACKEND || "http://localhost:5000";

// Async thunk to fetch chat groups the user is joined in
export const getUserChatGroups = createAsyncThunk(
  "chatGroups/getUserChatGroups",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/user/user-chat-groups`, {
        params: { userId }
      },
      { withCredentials: true } 
    );
      return response.data.chatGroups;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Async thunk to fetch initial messages for a chat group
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (chatGroupId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/user/messages/${chatGroupId}`,
        { withCredentials: true } );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);
export const getAdminUserChatGroup = createAsyncThunk(
  "chatWithAdmin/getAdminUserChatGroup",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/user/AdminUserChatgroup`, {
        params: { userId }
      });
      return response.data.privateChat;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Async thunk to fetch older messages (pagination)
export const fetchOlderMessages = createAsyncThunk(
  "messages/fetchOlderMessages",
  async ({ chatGroupId, before }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/user/getOlderMessages/${chatGroupId}`, {
        params: { before }
      },
      { withCredentials: true } );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


export const fetchSingleMessages = createAsyncThunk(
  "chatGroups/fetchSingleMessages",
  async (chatGroupId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/user/single-chat/${chatGroupId}`);
      return response.data.messages; // Return only messages array
      
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


export const fetchAdminChatGroups = createAsyncThunk(
  "chatGroups/fetchAdminChatGroups",
  async (adminId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/user/admin-chatgroups/${adminId}`);
      return response.data.chatGroups; // Extracting chat groups array
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch chat groups");
    }
  }
);

// Async thunk to fetch admin user single chats
export const fetchAdminUserSingleChats = createAsyncThunk(
  "chatGroups/fetchAdminUserSingleChats",
  async (adminId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/user/single-allchats/${adminId}`);
      return response.data; // Store full response, not just chatGroups
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);


const chatGroupsSlice = createSlice({
  name: "chatGroups",
  initialState: {
    chatGroups: [],
    adminChatGroups: [],
    data: null,
    loading: false,
    messagesLoading: false,
    error: null,
    activeChat: null,
    messages: [],
    hasMore: false,
    oldestMessageTimestamp: null,
    userAdminChatGroup: null,
  },
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
      state.messages = []; // Clear messages when changing chat
      state.hasMore = false;
      state.oldestMessageTimestamp = null;
    },
    addMessage: (state, action) => {
      // Check if the message is for the current active chat
      if (state.activeChat && action.payload.chatGroupId === state.activeChat._id) {
        // Add the message regardless of whether it's a duplicate or not
        state.messages.push(action.payload);
      }
      
      // Update the lastMessage for the relevant chat group
      const chatIndex = state.chatGroups.findIndex(
        (group) => group._id === action.payload.chatGroupId
      );
      
      if (chatIndex !== -1) {
        // Update the lastMessage with the new message
        state.chatGroups[chatIndex].lastMessage = {
          text: action.payload.text,
          time: `${action.payload.time?.hour}:${action.payload.time?.minute.toString().padStart(2, '0')}`
        };
        
        // Move this chat to the top of the list for newest first
        const updatedGroup = { ...state.chatGroups[chatIndex] };
        state.chatGroups.splice(chatIndex, 1);
        state.chatGroups.unshift(updatedGroup);
      }
    },
    // Add a reducer for real-time updates to chat groups
    updateChatGroupStatus: (state, action) => {
      const { chatGroupId, status } = action.payload;
      const chatIndex = state.chatGroups.findIndex(group => group._id === chatGroupId);
      
      if (chatIndex !== -1) {
        state.chatGroups[chatIndex].status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle getUserChatGroups
      .addCase(getUserChatGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserChatGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.chatGroups = action.payload;
      })
      .addCase(getUserChatGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle fetchMessages (initial messages)
      .addCase(fetchMessages.pending, (state) => {
        state.messagesLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messagesLoading = false;
        state.messages = action.payload.messages;
        state.hasMore = action.payload.messages.length >= 100; // Backend limits to 100 messages
        
        // Store oldest message timestamp for pagination
        if (action.payload.messages.length > 0) {
          state.oldestMessageTimestamp = action.payload.messages[0].createdAt;
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.messagesLoading = false;
        state.error = action.payload;
      })
      
      // Handle fetchOlderMessages (pagination)
      .addCase(fetchOlderMessages.pending, (state) => {
        state.messagesLoading = true;
        state.error = null;
      })
      .addCase(fetchOlderMessages.fulfilled, (state, action) => {
        state.messagesLoading = false;
        
        // Prepend older messages to the existing messages
        state.messages = [...action.payload.messages, ...state.messages];
        state.hasMore = action.payload.hasMore;
        
        // Update oldest message timestamp for next pagination request
        if (action.payload.messages.length > 0) {
          state.oldestMessageTimestamp = action.payload.messages[0].createdAt;
        }
      })
      .addCase(fetchOlderMessages.rejected, (state, action) => {
        state.messagesLoading = false;
        state.error = action.payload;
      })
      .addCase(getAdminUserChatGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminUserChatGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.userAdminChatGroup = action.payload;
      })
      .addCase(getAdminUserChatGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSingleMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchSingleMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminChatGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminChatGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.adminChatGroups = action.payload;
      })
      .addCase(fetchAdminChatGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminUserSingleChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUserSingleChats.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // Store entire response
      })
      .addCase(fetchAdminUserSingleChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export const { setActiveChat, addMessage, updateChatGroupStatus, g } = chatGroupsSlice.actions;
export default chatGroupsSlice.reducer;