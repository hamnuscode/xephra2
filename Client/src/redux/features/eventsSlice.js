// src/features/events/eventsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_BACKEND;

// Thunk for creating a new event
export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/admin/newevent`, formData,
        { withCredentials: true } , {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// slice for getting all the events
export const getEvents = createAsyncThunk(
  "events/getEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/admin/postedevents`, { withCredentials: true });
      return response.data.events;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// slice for delete an event
export const deleteEventById = createAsyncThunk(
  "events/deleteEventById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${apiUrl}/admin/delete/${id}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const editEvent = createAsyncThunk(
  "events/editEvent",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/admin/eventedit/${id}`,
        updatedData, { withCredentials: true }
      );
      return response.data.event;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const getEventById = createAsyncThunk(
  "events/getEventById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/admin/event/${id}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// joining an event thunk
export const joinEvent = createAsyncThunk(
  "events/joinEvent",
  async ({ userId, eventId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/user/event-join`, {
        userId,
        eventId,
      }, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Save team data thunk
export const saveTeamData = createAsyncThunk(
  "events/saveTeamData",
  async ({ userId, eventId, teamData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/user/save-team-data`, {
        userId,
        eventId,
        teamData,
      }, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Create async thunk for fetching events
export const getEventsByUserId = createAsyncThunk(
  'events/getEventsByUserId',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/user/registered-events`, { userId }, { withCredentials: true }); // Assuming '/api/events' is the endpoint
      return response.data.events;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const fetchEventUsers = createAsyncThunk(
  "eventUsers/fetchEventUsers",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/admin/event-users/${eventId}`, { withCredentials: true });
      return response.data.participantsData;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const markEventAsHosted = createAsyncThunk(
  "events/markEventAsHosted",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/admin/events/${eventId}/host`, { withCredentials: true }
      );
      return response.data.event;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchHostedTournaments = createAsyncThunk(
  "events/fetchHostedTournaments",
  async () => {
    const response = await axios.get(`${apiUrl}/user/events/hosted`, { withCredentials: true });
    return response.data;
  }
);



const eventsSlice = createSlice({
  name: "events",
  initialState: {
    event: null,
    events: [],
    registeredEvents: [],
    participants: [],
    hostEvent: null,
    hostedEvents: [],
    teamData: null,
    message: "",
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.event = action.payload.event;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.events = state.events.filter(
          (event) => event._id !== action.payload.event._id
        );
      })
      .addCase(deleteEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.event = action.payload;
      })
      .addCase(editEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.event = action.payload.event;
        state.message = action.payload.message;
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(joinEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.participants.push(action.payload.participant);
        state.message = action.payload.message;
      })
      .addCase(joinEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(saveTeamData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveTeamData.fulfilled, (state, action) => {
        state.loading = false;
        state.teamData = action.payload.teamData;
        state.message = action.payload.message;
      })
      .addCase(saveTeamData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(getEventsByUserId.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEventsByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.participants = action.payload; 
      })
      .addCase(getEventsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEventUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.participants = action.payload;
      })
      .addCase(fetchEventUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markEventAsHosted.pending, (state) => {
        state.loading = true;
      })
      .addCase(markEventAsHosted.fulfilled, (state, action) => {
        state.loading = false;
        state.hostEvent = action.payload;
      })
      .addCase(markEventAsHosted.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchHostedTournaments.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchHostedTournaments.fulfilled, (state, action) => {
        state.loading = false;
        state.hostedEvents = action.payload;
      })
      .addCase(fetchHostedTournaments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, clearMessage } = eventsSlice.actions;
export default eventsSlice.reducer;
