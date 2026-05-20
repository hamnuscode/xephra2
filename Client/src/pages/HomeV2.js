import React, { useState } from "react";
import logo from "../assets/xephra logo-01.png";
import { Link, useNavigate } from "react-router-dom";
import GamesCardsV2 from "../components/HomePageComponents/GamesCardsV2";
import UpcomingTournaments from "../components/HomePageComponents/UpcomingTournaments";
import PricesV2 from "../components/HomePageComponents/PricesV2";
import Footer from "../components/HomePageComponents/Footer";
import HeroGFX from "../components/HomePageComponents/HeroGFX";
import { logout } from "../redux/features/authSlice";
import { useDispatch } from "react-redux";

const HomeV2 = () => {
  const [activeNav, setActiveNav] = useState("Home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navItems = ["Home", "Games", "Tournaments", "Prices"];

  const handleNavClick = (item) => {
    setActiveNav(item);
    setIsMenuOpen(false);
    const sectionMap = {
      Home: "hero-section",
      Games: "games-section",
      Tournaments: "tournaments-section",
      Prices: "prices-section",
    };
    const el = document.getElementById(sectionMap[item]);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const logoutSubmit = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen" style={{ background: "#0A0E27" }}>
      {/* ── Header ─────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 h-16 px-6 flex items-center"
        style={{
          background: "rgba(10, 14, 39, 0.95)",
          borderBottom: "1px solid rgba(0, 229, 255, 0.12)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src={logo} alt="Xephra" className="h-8 w-auto" />
          </Link>

          {/* Nav — desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className="nav-item text-sm"
                style={activeNav === item ? { color: "#00E5FF", borderBottomColor: "#00E5FF" } : {}}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === "admin" ? "/dashboard" : "/userdashboard"}
                  className="btn-primary py-2 px-4 text-sm"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logoutSubmit}
                  className="hidden sm:block btn-ghost py-2 px-4 text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost py-2 px-4 text-sm hidden sm:block">
                  Sign in
                </Link>
                <Link to="/signup" className="btn-primary py-2 px-4 text-sm">
                  Get started
                </Link>
              </>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md transition-colors"
              style={{ color: "#9CA3AF" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00E5FF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      {isMenuOpen && (
        <div
          className="lg:hidden sticky top-16 z-40 px-6 py-4 space-y-1"
          style={{
            background: "rgba(10, 14, 39, 0.98)",
            borderBottom: "1px solid rgba(0, 229, 255, 0.1)",
          }}
        >
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => handleNavClick(item)}
              className="block w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors"
              style={{
                color: activeNav === item ? "#00E5FF" : "#9CA3AF",
                background: activeNav === item ? "rgba(0, 229, 255, 0.06)" : "transparent",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {item}
            </button>
          ))}
          {isAuthenticated && (
            <button
              onClick={logoutSubmit}
              className="block w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors"
              style={{ color: "#EF4444", fontFamily: "Inter, sans-serif" }}
            >
              Logout
            </button>
          )}
        </div>
      )}

      {/* ── Hero Section ──────────────────────────── */}
      <section
        id="hero-section"
        className="relative min-h-[92vh] flex items-center px-6 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0A0E27 0%, #0d1245 40%, #0A0E27 100%)", borderBottom: "1px solid #1E2A3A" }}
      >
        {/* Animated grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,229,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.045) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            animation: "gridScroll 8s linear infinite",
            pointerEvents: "none",
          }}
        />
        {/* Edge fade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(10,14,39,0.85) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="relative max-w-7xl mx-auto w-full py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — text content */}
            <div>
              {/* Tag */}
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
                style={{
                  background: "rgba(0, 229, 255, 0.08)",
                  border: "1px solid rgba(0, 229, 255, 0.2)",
                  color: "#00E5FF",
                  fontFamily: "IBM Plex Mono, monospace",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                #1 Gaming Arena
              </div>

              {/* Headline */}
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6"
                style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA", letterSpacing: "-0.02em" }}
              >
                Where Gamers
                <br />
                <span style={{ color: "#00E5FF" }}>Compete</span>
                <br />
                For Glory
              </h1>

              <p
                className="text-lg sm:text-xl mb-10 max-w-lg"
                style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif", lineHeight: 1.7 }}
              >
                Enter the tournament arena. Compete against the best. Climb the ranks. Claim your prize.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link to="/signup" className="btn-primary py-4 px-8 text-base">
                  Enter The Arena
                </Link>
                <button
                  onClick={() => handleNavClick("Tournaments")}
                  className="btn-secondary py-4 px-8 text-base"
                >
                  View Tournaments
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 mt-16">
                {[
                  { value: "500+", label: "Active Players" },
                  { value: "50+", label: "Tournaments Held" },
                  { value: "PKR 1M+", label: "Prize Pool" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div
                      className="text-3xl font-bold"
                      style={{ fontFamily: "IBM Plex Mono, monospace", color: "#00E5FF" }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm mt-1" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — animated 3D GFX */}
            <div className="hidden lg:block" style={{ height: 520 }}>
              <HeroGFX />
            </div>
          </div>
        </div>

      </section>

      {/* ── Games Section ─────────────────────────── */}
      <div id="games-section">
        <GamesCardsV2 />
      </div>

      {/* ── Tournaments Section ───────────────────── */}
      <div id="tournaments-section">
        <UpcomingTournaments />
      </div>

      {/* ── Prices Section ────────────────────────── */}
      <div id="prices-section">
        <PricesV2 />
      </div>

      {/* ── Footer ────────────────────────────────── */}
      <div id="footer-section">
        <Footer handleNavClick={handleNavClick} />
      </div>
    </div>
  );
};

export default HomeV2;
