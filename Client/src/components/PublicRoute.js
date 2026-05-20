// components/PublicRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = JSON.parse(localStorage.getItem("user"))?.role;

  if (token) {
    if (role === "admin") return <Navigate to="/dashboard" />;
    if (role === "user") return <Navigate to="/userdashboard" />;
  }

  return children;
};

export default PublicRoute;
