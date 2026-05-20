import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../utils/Loading/Loading";

const GoogleSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from URL
    const queryParams = new URLSearchParams(window.location.search);
    const userDataString = queryParams.get("data");

    if (userDataString) {
      // Parse user data from URL
      const userData = JSON.parse(decodeURIComponent(userDataString));

      // Store user data in local storage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", JSON.stringify(userData.token));

      // Redirect to dashboard
      navigate("/userDashboard");
    }
  }, [navigate]);

  return <Loading />
};

export default GoogleSuccess;