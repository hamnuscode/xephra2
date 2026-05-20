// src/redux/features/paymentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND;

// ========== Async Thunks ==========

// 1. Submit new payment
export const submitPayment = createAsyncThunk(
  "payment/submitPayment",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/payments/submit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Payment submission failed"
      );
    }
  }
);

// 2. Get payment by ID
export const getPaymentById = createAsyncThunk(
  "payment/getPaymentById",
  async (paymentId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/payments/payment/${paymentId}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch payment"
      );
    }
  }
);

// 3. Get all user payments
export const getUserPayments = createAsyncThunk(
  "payment/getUserPayments",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_URL}/api/payments/user/${userId}/payments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user payments"
      );
    }
  }
);

// 4. Get current subscription status
export const getSubscriptionStatus = createAsyncThunk(
  "payment/getSubscriptionStatus",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_URL}/payments/user/${userId}/subscription-status`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data; // { isVerified, isActive, message, ... }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch subscription status"
      );
    }
  }
);

// 5. Get all payments (Admin)
export const getAllPayments = createAsyncThunk(
  "payment/getAllPayments",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const queryString = new URLSearchParams(queryParams).toString();
      const res = await axios.get(
        `${API_URL}/payments/admin/all${queryString ? `?${queryString}` : ""}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch all payments"
      );
    }
  }
);

// 6. Admin: Update payment
export const updatePaymentById = createAsyncThunk(
  "payment/updatePaymentById",
  async ({ paymentId, updatedData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${API_URL}/payments/admin/${paymentId}/update`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update payment"
      );
    }
  }
);

// 7. Admin: Verify payment
export const verifyPaymentById = createAsyncThunk(
  "payment/verifyPaymentById",
  async (paymentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${API_URL}/payments/admin/${paymentId}/verify`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to verify payment"
      );
    }
  }
);

// 8. Admin: Reject payment with reason
export const rejectPaymentById = createAsyncThunk(
  "payment/rejectPaymentById",
  async ({ paymentId, rejectionReason }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${API_URL}/payments/admin/${paymentId}/reject`,
        { rejectionReason }, // Send rejection reason in request body
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to reject payment"
      );
    }
  }
);

// 9. Get categorized subscriptions for a user
export const getCategorizedUserSubscriptions = createAsyncThunk(
  "payment/getCategorizedUserSubscriptions",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_URL}/payments/user/${userId}/subscriptions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data; // { active: [], expired: [], pending: [], rejected: [], total: number }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user subscriptions"
      );
    }
  }
);

// 10. Delete a pending subscription by paymentId
export const deletePendingSubscriptionByPaymentId = createAsyncThunk(
  "payment/deletePendingSubscriptionByPaymentId",
  async (paymentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${API_URL}/payments/subscriptions/pending/by-payment-id/${paymentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data; // Expected: { message: "Subscription deleted successfully" }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete pending subscription"
      );
    }
  }
);

// ========== Slice ==========

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    loading: false,
    error: null,
    successMessage: "",
    submittedPayment: null,
    paymentDetails: null,
    userPayments: [],
    subscriptionStatus: null,
    adminPayments: [], // ✅ For admin payment list
    pagination: null, // ✅ For admin pagination

    // Additional state for UI control - removed uploadedFile
    fileMetadata: {
      name: null,
      size: null,
      type: null,
    },
    copiedText: "",
    showInstructions: false,
    selectedPlan: null,
    formData: {},
    paymentMethod: "",
    categorizedSubscriptions: {
      active: [],
      expired: [],
      pending: [],
      rejected: [],
      total: 0,
    },
    subscriptionStatus: {
      isVerified: false,
      isActive: false,
      loading: false,
      error: null,
      message: "",
    },
  },
  reducers: {
    clearPaymentState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = "";
      state.submittedPayment = null;
    },
    setFileMetadata: (state, action) => {
      state.fileMetadata = action.payload;
    },
    setCopiedText: (state, action) => {
      state.copiedText = action.payload;
    },
    resetPaymentState: (state) => {
      state.fileMetadata = {
        name: null,
        size: null,
        type: null,
      };
      state.copiedText = "";
      state.showInstructions = false;
      state.selectedPlan = null;
      state.formData = {};
      state.paymentMethod = "";
    },
    setShowInstructions: (state, action) => {
      state.showInstructions = action.payload;
    },
    setSelectedPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit Payment
      .addCase(submitPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Payment submitted successfully";
        state.submittedPayment = action.payload;
      })
      .addCase(submitPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Payment by ID
      .addCase(getPaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentDetails = action.payload;
      })
      .addCase(getPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get User Payments
      .addCase(getUserPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.userPayments = action.payload;
      })
      .addCase(getUserPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Admin: Get All Payments
      .addCase(getAllPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.adminPayments = action.payload.data.payments;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getAllPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Admin: Update Payment
      .addCase(updatePaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Payment updated successfully";
      })
      .addCase(updatePaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Admin: Verify Payment
      .addCase(verifyPaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Payment verified successfully";
      })
      .addCase(verifyPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Admin: Reject Payment
      .addCase(rejectPaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Payment rejected successfully";
      })
      .addCase(rejectPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get categorized subscriptions for a user
      .addCase(getCategorizedUserSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategorizedUserSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.categorizedSubscriptions = action.payload;
      })
      .addCase(getCategorizedUserSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete pending subscription
      .addCase(deletePendingSubscriptionByPaymentId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deletePendingSubscriptionByPaymentId.fulfilled,
        (state, action) => {
          state.loading = false;
          state.successMessage = action.payload.message;
          // Optional: you can also remove the deleted item from state.userPayments or state.categorizedSubscriptions.pending if needed
        }
      )
      .addCase(
        deletePendingSubscriptionByPaymentId.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Check Subscription Status
      .addCase(getSubscriptionStatus.pending, (state) => {
        state.subscriptionStatus.loading = true;
        state.subscriptionStatus.error = null;
      })
      .addCase(getSubscriptionStatus.fulfilled, (state, action) => {
        state.subscriptionStatus.loading = false;
        state.subscriptionStatus.isVerified = action.payload.isVerified;
        state.subscriptionStatus.isActive = action.payload.isActive;
        state.subscriptionStatus.message = action.payload.message;
      })
      .addCase(getSubscriptionStatus.rejected, (state, action) => {
        state.subscriptionStatus.loading = false;
        state.subscriptionStatus.error = action.payload;
      });
  },
});

export const {
  clearPaymentState,
  setFileMetadata,
  setCopiedText,
  resetPaymentState,
  setShowInstructions,
  setSelectedPlan,
  setFormData,
  setPaymentMethod,
} = paymentSlice.actions;

export default paymentSlice.reducer;
