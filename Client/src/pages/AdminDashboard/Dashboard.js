import React, { useState, useEffect } from "react";
import Header from "../../components/AdminDashobard/Header";
import { menuItems } from "../../components/AdminDashobard/AdminMenus";
import PostedEvents from "../../components/AdminDashobard/PostedEvents";
import NewEvents from "../../components/AdminDashobard/NewEvents";
import RankingApproval from "../../components/AdminDashobard/RankingApproval";
import Dashboardadmin from "../../components/AdminDashobard/Dashboardadmin";
import logo from "../../assets/xephra logo-01.png";
import AdminProfile from "../../components/AdminDashobard/AdminProfile";
import AdminNotificationPanel from "../../components/Notifications/AdminNotificationPanel";
import NotificationDebug from "../../components/Notifications/NotificationDebug";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { getProfile } from "../../redux/features/profileSlice";
import CompletedEvents from "../../components/AdminDashobard/CompletedEvents";
import RankingBoard from "../../components/AdminDashobard/RankingBoard";

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
                  if (item.key === "PaymentPanel") {
                    navigate("/payment-verification-panel");
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
        <Link to="/dashboard/chats" className="block">
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

// Mobile Sidebar
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

// Main Dashboard
function Dashboard() {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.profile);
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.UserId;

  useEffect(() => {
    if (userId) dispatch(getProfile(userId));
  }, [dispatch, userId]);

  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [dark, setDark] = useState(true);

  const toggleSideMenu = () => setIsSideMenuOpen(!isSideMenuOpen);
  const toggleTheme = () => setDark(!dark);

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard": return <Dashboardadmin setActiveMenu={setActiveMenu} dark={dark} />;
      case "postedEvents": return <PostedEvents setActiveMenu={setActiveMenu} dark={dark} />;
      case "newEvents": return <NewEvents setActiveMenu={setActiveMenu} dark={dark} />;
      case "rankingBoard": return <RankingBoard dark={dark} />;
      case "CompletedEvents": return <CompletedEvents dark={dark} />;
      case "rankingApproval": return <RankingApproval dark={dark} />;
      case "notifications": return <div><NotificationDebug /><AdminNotificationPanel /></div>;
      case "adminProfile": return <AdminProfile dark={dark} profile={profile} />;
      default: return <Dashboardadmin setActiveMenu={setActiveMenu} dark={dark} />;
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#0A0E27" }}
    >
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 flex-shrink-0 h-screen sticky top-0">
        <Sidebar dark={dark} activeMenu={activeMenu} onMenuClick={setActiveMenu} />
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
            dark={dark}
            toggleSideMenu={toggleSideMenu}
            toggleTheme={toggleTheme}
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
