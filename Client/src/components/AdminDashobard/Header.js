import React from "react";
import { Link } from "react-router-dom";
import { BsFillMenuButtonWideFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import NotificationBell from "../Notifications/NotificationBell";

export default function Header({
  toggleSideMenu,
  onMenuClick,
  profile,
}) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const userId = user?._id || profile?.userId || profile?._id || "admin";

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
          {/* Notification Bell */}
          <NotificationBell
            userId={userId}
            userType="admin"
            isAdmin={true}
          />

          {/* Profile */}
          <button
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all duration-150"
            onClick={() => onMenuClick("adminProfile")}
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
              {profile?.username || "Admin"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
