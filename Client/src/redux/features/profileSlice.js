// src/features/profile/profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = process.env.REACT_APP_BACKEND;

export const createProfile = createAsyncThunk(
  "profile/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiUrl}/admin/createProfile`,
        formData, { withCredentials: true },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// GET profile action
export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/admin/profile/${userId}`, { withCredentials: true });
      return response.data; // Profile data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch profile");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/admin/profile/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }, { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// get all users
export const getAllUsers = createAsyncThunk(
  "profile/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios(`${apiUrl}/user/getusers`, { withCredentials: true });
      return response.data.users;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// delete a user by passing userId
export const deleteUser = createAsyncThunk(
  "profile/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${apiUrl}/user/user/${userId}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

// / Async thunk to suspend/unsuspend a user
export const suspendUser = createAsyncThunk(
  "profile/suspendUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/user/usersuspend/${userId}`, { withCredentials: true }
      );
      return { userId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data
          ? error.response.data
          : { message: "An error occurred" }
      );
    }
  }
);

// thunk for a getuser
export const getUser = createAsyncThunk(
  "profile/getUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/user/user/${userId}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return error.response?.data?.message || "Failed to get user profile";
    }
  }
);

export const gettotaluserandevents = createAsyncThunk(
  "profile/gettotaluserandevents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios(`${apiUrl}/admin/gettotalusersandevents`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    users: [],
    successMessage: null,
    loading: false,
    error: null,
    userCount: [],
    eventCount: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
        state.users = state.users.filter(
          (user) => user.userId !== action.meta.arg
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(suspendUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(suspendUser.fulfilled, (state, action) => {
        state.loading = false;
        // Update the specific user's `isSuspended` status in the `users` array
        const { userId, isSuspended } = action.payload;
        const userIndex = state.users.findIndex(
          (user) => user.userId === userId
        );
        if (userIndex !== -1) {
          state.users[userIndex].isSuspended = isSuspended;
        }
      })
      .addCase(suspendUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(gettotaluserandevents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(gettotaluserandevents.fulfilled, (state, action) => {
        state.loading = false;
        state.userCount = action.payload.totalUsers;
        state.eventCount = action.payload.totalEvents;
      })
      .addCase(gettotaluserandevents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export const selectProfile = (state) => state.profile.profile;
export const selectProfileStatus = (state) => state.profile.loading;
export const selectProfileError = (state) => state.profile.error;

export default profileSlice.reducer;
