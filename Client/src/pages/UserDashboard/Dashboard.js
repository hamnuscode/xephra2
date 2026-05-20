import React, { useEffect, useState } from "react";
import Header from "../../components/UserDashobard/Header";
import { menuItems } from "../../components/UserDashobard/UserMenus";
import logo from "../../assets/xephra logo-01.png";
import UserProfile from "../../components/UserDashobard/UserProfile";
import DashboardUser from "../../components/UserDashobard/DashboardUser";
import UpcomingEvents from "../../components/UserDashobard/UpcomingEvents";
import RegisteredEvents from "../../components/UserDashobard/RegisteredEvents";
import RankingBoard from "../../components/UserDashobard/RankingBoard";
import RankingApproval from "../../components/UserDashobard/RankingApproval";
import UserNotificationPanel from "../../components/Notifications/UserNotificationPanel";
import { logout } from "../../redux/features/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../redux/features/userSlice";
import CompletedEvents from "../../components/UserDashobard/CompletedEvents";

// Sidebar component
function Sidebar({ onMenuClick, activeMenu }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutSubmit = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#0A0E27", borderRight: "1px solid rgba(75,85,99,0.2)" }}
    >
      {/* Logo */}
      <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(75,85,99,0.15)" }}>
        <Link to="/" className="flex items-center">
          <img src={logo} className="h-8 w-auto" alt="Rival" />
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul>
          {menuItems.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => {
                  if (item.key === "paymentPortal") {
                    navigate("/paymentportal");
                  } else {
                    onMenuClick(item.key);
                  }
                }}
                className="sidebar-item w-full"
                style={activeMenu === item.key ? {
                  color: "#00E5FF",
                  borderLeftColor: "#00E5FF",
                  background: "rgba(0, 229, 255, 0.08)",
                } : {}}
              >
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="px-5 pb-8 space-y-3" style={{ borderTop: "1px solid rgba(75,85,99,0.15)", paddingTop: "20px" }}>
        <Link to="/userdashboard/chats" className="block">
          <button
            className="w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-150"
            style={{
              background: "rgba(0,229,255,0.08)",
              border: "1px solid rgba(0,229,255,0.25)",
              color: "#00E5FF",
              fontFamily: "Inter, sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0,229,255,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,229,255,0.08)";
            }}
          >
            Chat System
          </button>
        </Link>
        <button
          onClick={logoutSubmit}
          className="w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-150"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
            color: "#EF4444",
            fontFamily: "Inter, sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.08)";
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
}

// Mobile Sidebar component
function MobileSidebar({ onMenuClick, toggleSideMenu, isSideMenuOpen, activeMenu }) {
  return (
    <div
      className={`fixed inset-y-0 z-30 w-64 overflow-y-auto transform transition-transform duration-200 md:hidden ${
        isSideMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <Sidebar
        activeMenu={activeMenu}
        onMenuClick={(key) => {
          onMenuClick(key);
          toggleSideMenu();
        }}
      />
    </div>
  );
}

// Main Dashboard component
function Dashboard() {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.UserId;

  useEffect(() => {
    if (userId) dispatch(getProfile(userId));
  }, [dispatch, userId]);

  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const toggleSideMenu = () => setIsSideMenuOpen(!isSideMenuOpen);

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard": return <DashboardUser setActiveMenu={setActiveMenu} />;
      case "upcomingEvents": return <UpcomingEvents />;
      case "registeredEvents": return <RegisteredEvents />;
      case "rankingBoard": return <RankingBoard />;
      case "CompletedEvents": return <CompletedEvents />;
      case "rankingApproval": return <RankingApproval />;
      case "notifications": return <UserNotificationPanel />;
      case "userProfile": return <UserProfile profile={profile} />;
      default: return <DashboardUser setActiveMenu={setActiveMenu} />;
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#0A0E27" }}
    >
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 flex-shrink-0 h-screen sticky top-0">
        <Sidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} />
      </aside>

      {/* Mobile backdrop */}
      {isSideMenuOpen && (
        <div
          onClick={toggleSideMenu}
          className="fixed inset-0 z-20 md:hidden"
          style={{ background: "rgba(0,0,0,0.6)" }}
        />
      )}

      {/* Mobile sidebar */}
      <MobileSidebar
        activeMenu={activeMenu}
        isSideMenuOpen={isSideMenuOpen}
        toggleSideMenu={toggleSideMenu}
        onMenuClick={setActiveMenu}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        <div style={{ borderBottom: "1px solid rgba(75,85,99,0.15)", background: "rgba(10,14,39,0.98)" }}>
          <Header
            toggleSideMenu={toggleSideMenu}
            onMenuClick={setActiveMenu}
            profile={profile}
          />
        </div>
        <main
          className="flex-1 overflow-y-auto p-4 md:p-6"
          style={{ background: "#0A0E27" }}
        >
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
