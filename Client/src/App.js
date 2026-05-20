import React, { Suspense, lazy, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import socketService from "./utils/socket";
import { Toaster } from 'react-hot-toast';

import Loading from "./utils/Loading/Loading";
import RegisterEventDetailUser from "./components/UserDashobard/RegisterEventDetailUser";
import PaymentForm from "./pages/PaymentForm/PaymentForm";
import VerifyEmail from "./pages/VerifyEmail";
import UserPaymentPortal from "./components/UserDashobard/PaymentPortal/PaymentPortal";
import PaymentVerificationPanel from "./components/AdminDashobard/PaymentPanel/PaymentVerificationPanel";
import HomeV2 from "./pages/HomeV2";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Unauthorized from "./pages/Unauthorized";
const Signup = lazy(() => import("./pages/Signup"));
const ForgetPassword = lazy(() => import("./pages/ForgetPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/AdminDashboard/Dashboard"));
const UserDashboard = lazy(() => import("./pages/UserDashboard/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const Users = lazy(() => import("./components/AdminDashobard/Users"));
const TournamentRanking = lazy(() =>
  import("./components/AdminDashobard/TournamentRanking")
);
const EventDetailAdmin = lazy(() =>
  import("./components/AdminDashobard/EventDetailAdmin")
);
const EventDetailUser = lazy(() =>
  import("./components/UserDashobard/EventDetailUser")
);
const TournamentUsersRankingApproval = lazy(() =>
  import("./components/AdminDashobard/TournamentUsersRankingApproval")
);
const AllUserRankingBoard = lazy(() =>
  import("./components/AdminDashobard/AllUserRankingBoard")
);
const EventDetailUserDashboard = lazy(() =>
  import("./components/UserDashobard/EventDetailUserDashboard")
);
const TournamentRankings = lazy(() =>
  import("./components/UserDashobard/TournamentRankings")
);
const AllUserRankingUser = lazy(() =>
  import("./components/UserDashobard/AllUserRankingUser")
);
const GoogleSuccess = lazy(() => import("./components/GoogleSuccess"));
const Home = lazy(() => import("./pages/Home"));
const ChatSystem = lazy(() => import("./components/ChatSystem"));

export default function App() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      socketService.connect(user._id);
    }

    return () => {
      if (!isAuthenticated) {
        socketService.disconnect();
      }
    };
  }, [isAuthenticated, user]);

  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<HomeV2 />} />
          <Route path="*" element={<HomeV2 />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/home" element={<Home />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          <Route path="/google-success" element={<GoogleSuccess />} />
          <Route path="/forget" element={<ForgetPassword />} />
          <Route path="/reset/:token" element={<ResetPassword />} />
          <Route
            path="/userdashboard/chats"
            element={
              <ProtectedRoute allowedRole="user">
                <ChatSystem />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/chats"
            element={
              <ProtectedRoute allowedRole="admin">
                <ChatSystem />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userdashboard"
            element={
              <ProtectedRoute allowedRole="user">
                <UserDashboard />{" "}
              </ProtectedRoute>
            }
          />

          <Route path="/eventadmin/:eventId" element={<EventDetailAdmin />} />
          <Route path="/eventuser/:eventId" element={<EventDetailUser />} />
          <Route
            path="/registereventuser/:eventId"
            element={<RegisterEventDetailUser />}
          />
          <Route
            path="/userdashboard/eventdetailuser/:eventId"
            element={<EventDetailUserDashboard />}
          />
          <Route path="/dashboard/users" element={<Users />} />
          <Route
            path="/dashboard/allranking"
            element={
              <ProtectedRoute allowedRole="admin">
                <AllUserRankingBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userdashboard/allranking"
            element={
              <ProtectedRoute allowedRole="user">
                <AllUserRankingUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/tournamentrankings/:eventId"
            element={
              <ProtectedRoute allowedRole="admin">
                <TournamentRanking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userdashboard/tournamentrankings/:eventId"
            element={
              <ProtectedRoute allowedRole="user">
                <TournamentRankings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/tournamentrankingapproval/:eventId"
            element={
              <ProtectedRoute allowedRole="admin">
                <TournamentUsersRankingApproval />
              </ProtectedRoute>
            }
          />
          <Route path="/paymentform" element={<PaymentForm />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route
            path="/paymentportal"
            element={
              <ProtectedRoute allowedRole="user">
                <UserPaymentPortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-verification-panel"
            element={
              <ProtectedRoute allowedRole="admin">
                <PaymentVerificationPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </BrowserRouter>
  );
}
