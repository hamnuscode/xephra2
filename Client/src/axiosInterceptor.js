import axios from "axios";
import { logout } from "./redux/features/authSlice";

// This function sets up a global axios response interceptor
export const setupAxiosInterceptors = (store) => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response &&
        error.response.status === 401 &&
        (error.response.data?.error === "jwt expired" || error.response.data?.error === "Invalid or expired token")
      ) {
        // Dispatch logout action
        store.dispatch(logout());
        // Optionally, redirect to login
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
};
