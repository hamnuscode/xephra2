// src/features/profile/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = process.env.REACT_APP_BACKEND;

export const createProfile = createAsyncThunk(
  "user/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiUrl}/user/createProfile`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }, { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// GET profile action
export const getProfile = createAsyncThunk(
  "user/getProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${apiUrl}/user/profile/${userId}`, { withCredentials: true }
      );
      return response.data; // Profile data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch profile");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/user/profile/${userId}`,
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

export const checkUserProfile = createAsyncThunk(
  'user/checkUserProfile',
  async (userId , {rejectWithValue}) => {
    try {
      const response = await axios.get(`${apiUrl}/user/profile-exit/${userId}`, { withCredentials: true });
      return response.data.exists;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchUserBadge = createAsyncThunk(
  "user/fetchUserBadge",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/user/user-badge/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching badge");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    loading: false,
    badge: "",
    profileExists: null,  
    error: null,
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
      .addCase(checkUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileExists = action.payload;
      })
      .addCase(checkUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserBadge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBadge.fulfilled, (state, action) => {
        state.loading = false;
        state.badge = action.payload.badge;
      })
      .addCase(fetchUserBadge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectProfile = (state) => state.profile.profile;
export const selectProfileStatus = (state) => state.profile.loading;
export const selectProfileError = (state) => state.profile.error;

export default userSlice.reducer;
