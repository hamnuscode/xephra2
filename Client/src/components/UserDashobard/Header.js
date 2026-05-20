import React, { useEffect } from "react";
import { BsFillMenuButtonWideFill } from "react-icons/bs";
import { getSubscriptionStatus } from "../../redux/features/paymentSlice";
import { useDispatch, useSelector } from "react-redux";
import NotificationBell from "../Notifications/NotificationBell";

export default function Header({ toggleSideMenu, onMenuClick, profile }) {
  const dispatch = useDispatch();
  const { subscriptionStatus } = useSelector((state) => state.payment);
  const { user } = useSelector((state) => state.auth);

  const userId = user?._id || profile?.userId || profile?._id;

  useEffect(() => {
    const id = profile?.userId || localStorage.getItem("userId");
    if (id) dispatch(getSubscriptionStatus(id));
  }, [dispatch, profile?.userId]);

  return (
    <header className="z-10 py-3 px-6">
      <div className="flex items-center justify-between h-full">
        {/* Mobile menu button */}
        <button
          className="p-2 rounded-lg md:hidden transition-colors"
          onClick={toggleSideMenu}
          aria-label="Menu"
          style={{ color: "#9CA3AF" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#00E5FF")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
        >
          <BsFillMenuButtonWideFill className="w-5 h-5" />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Subscription badge */}
          {profile?.userId && (
            <div
              className="hidden sm:flex items-center px-3 py-1 rounded-full text-xs font-semibold"
              style={
                subscriptionStatus?.isActive
                  ? {
                      background: "rgba(16,185,129,0.12)",
                      border: "1px solid rgba(16,185,129,0.35)",
                      color: "#10B981",
                      fontFamily: "IBM Plex Mono, monospace",
                    }
                  : {
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "#EF4444",
                      fontFamily: "IBM Plex Mono, monospace",
                    }
              }
            >
              {subscriptionStatus?.isActive ? "Active" : "No Plan"}
            </div>
          )}

          {/* Notification Bell */}
          <NotificationBell userId={userId} userType="user" isAdmin={false} />

          {/* Profile */}
          <button
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all duration-150"
            onClick={() => onMenuClick("userProfile")}
            style={{
              background: "rgba(0,229,255,0.06)",
              border: "1px solid rgba(0,229,255,0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0,229,255,0.12)";
              e.currentTarget.style.borderColor = "rgba(0,229,255,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,229,255,0.06)";
              e.currentTarget.style.borderColor = "rgba(0,229,255,0.15)";
            }}
          >
            <img
              src={
                profile?.profileImage
                  ? `${process.env.REACT_APP_BACKEND || "http://localhost:5000"}/${profile.profileImage}`
                  : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvyKxD07vzVrTXqVFK0myyV8KT99ZWBNNwGA&s"
              }
              alt="Profile"
              className="w-7 h-7 rounded-full object-cover flex-shrink-0"
              style={{ border: "1px solid rgba(0,229,255,0.3)" }}
            />
            <span
              className="text-sm font-medium hidden sm:block"
              style={{ color: "#F8F9FA", fontFamily: "Inter, sans-serif" }}
            >
              {profile?.username || "User"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
