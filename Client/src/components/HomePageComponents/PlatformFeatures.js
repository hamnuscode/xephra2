import React, { useState } from "react";

const CYAN = "#00E5FF";

const features = [
  {
    id: "tournaments",
    icon: "🏆",
    title: "Tournament Arena",
    tag: "Core",
    tagColor: CYAN,
    summary: "Compete in live gaming tournaments",
    detail: {
      description:
        "The Tournament Arena is the heart of Rival. Admins create and publish tournament events with details like game type, team size, start date, prize pool, and entry requirements. Players browse upcoming events, register individually or as a team, and compete head-to-head for ranking points and prizes.",
      highlights: [
        "Admins post events with full configuration (game, date, prize, team size)",
        "Players register and submit team rosters before the event locks",
        "Live event status tracking: Upcoming → Active → Completed",
        "Each event generates a dedicated ranking board after completion",
        "Admin can view all registered participants and manage entries",
      ],
      who: ["Admin", "Player"],
    },
  },
  {
    id: "rankings",
    icon: "📊",
    title: "Rankings & Leaderboard",
    tag: "Competitive",
    tagColor: "#FF7A00",
    summary: "Climb the global leaderboard with weighted scores",
    detail: {
      description:
        "Every tournament result feeds into a platform-wide weighted ranking system. Players earn points based on placement, competition level, and consistency. The global leaderboard shows all-time rankings while per-event boards let players track how they performed in specific tournaments.",
      highlights: [
        "Global leaderboard ranked by weighted score across all tournaments",
        "Per-tournament ranking boards with placement medals (🥇🥈🥉)",
        "Admins approve and post final rankings after each event",
        "Players can view their own stats and compare with others",
        "Ranking Approval panel lets admins manage contested results",
      ],
      who: ["Admin", "Player"],
    },
  },
  {
    id: "teams",
    icon: "🎮",
    title: "Team System",
    tag: "Social",
    tagColor: "#6D28D9",
    summary: "Register and compete as a squad",
    detail: {
      description:
        "Rival supports team-based tournament entry. When registering for an event, players can input team member Rival IDs to form a squad. The event detail page shows all registered teams and their rosters, and admins can view the full participant list for each tournament.",
      highlights: [
        "Enter team member Rival IDs when joining an event",
        "Team rosters are saved and visible to admins on the event page",
        "Admin participant view shows all teams and individual registrations",
        "Supports both solo and team-format tournaments",
        "Players can see all registered participants before an event starts",
      ],
      who: ["Player"],
    },
  },
  {
    id: "subscriptions",
    icon: "💳",
    title: "Subscription Plans",
    tag: "Access",
    tagColor: "#FF7A00",
    summary: "Choose a plan to unlock tournament access",
    detail: {
      description:
        "Tournament participation requires an active subscription. Rival offers three plans — Weekly (PKR 749), Monthly (PKR 1,499), and Quarterly (PKR 3,999) — each unlocking full access to all events and tournaments for the plan duration. Payments are made via bank transfer, JazzCash, or Easypaisa.",
      highlights: [
        "Three plans: Weekly, Monthly, Quarterly",
        "Submit payment proof (screenshot/receipt) via the Payment Portal",
        "Admin reviews and approves each payment manually",
        "Subscription status visible in player profile",
        "Active subscription required to register for any tournament",
      ],
      who: ["Player", "Admin"],
    },
  },
  {
    id: "payments",
    icon: "✅",
    title: "Payment Verification",
    tag: "Admin",
    tagColor: CYAN,
    summary: "Admin review and approval of player payments",
    detail: {
      description:
        "The Payment Verification Panel gives admins full control over subscription management. Every payment submitted by a player appears here with full details — plan, method, transaction ID, and receipt image. Admins can approve, reject, or edit entries, and filter by status to work efficiently.",
      highlights: [
        "View all pending, verified, and rejected payment submissions",
        "Filter and search by name, email, plan, payment method, or transaction ID",
        "Approve or reject with one click — player subscription updates instantly",
        "Edit payment details if data was entered incorrectly",
        "View uploaded payment receipts in a modal overlay",
      ],
      who: ["Admin"],
    },
  },
  {
    id: "chat",
    icon: "💬",
    title: "Real-Time Chat",
    tag: "Social",
    tagColor: "#6D28D9",
    summary: "Live messaging between players and admins",
    detail: {
      description:
        "Rival includes a real-time WebSocket-powered chat system. Players and admins can communicate in group channels and direct messages. The chat system is accessible directly from the dashboard sidebar, keeping everything in one place without leaving the platform.",
      highlights: [
        "Real-time messaging powered by Socket.IO",
        "Group chat channels for tournament coordination",
        "Admin support chat for player queries",
        "Message history preserved across sessions",
        "Accessible inline from both admin and player dashboards",
      ],
      who: ["Admin", "Player"],
    },
  },
  {
    id: "notifications",
    icon: "🔔",
    title: "Notifications",
    tag: "System",
    tagColor: CYAN,
    summary: "Stay updated on events, payments, and rankings",
    detail: {
      description:
        "The notification system keeps both players and admins informed in real time. Players receive alerts when their payment is approved, when a tournament they're registered for is about to start, and when rankings are posted. Admins get notified of new payment submissions and registration activity.",
      highlights: [
        "Real-time in-app notification panel for players and admins",
        "Payment approved/rejected alerts sent to players",
        "Tournament start reminders for registered participants",
        "New ranking post notifications after events complete",
        "Unread notification badge on dashboard header",
      ],
      who: ["Admin", "Player"],
    },
  },
  {
    id: "profiles",
    icon: "👤",
    title: "Player Profiles",
    tag: "Identity",
    tagColor: "#6D28D9",
    summary: "Public profiles with stats, rank, and history",
    detail: {
      description:
        "Every player on Rival has a profile showing their identity, subscription status, tournament history, and ranking stats. Admins can view any player's full profile directly from the ranking board. Players manage their own profile from the dashboard.",
      highlights: [
        "Profile includes name, Rival ID, subscription status, and profile picture",
        "Ranking stats and weighted score shown on profile",
        "Tournament history: registered, completed, and upcoming events",
        "Admins can view any player's full profile from the leaderboard",
        "Profile management from the user dashboard",
      ],
      who: ["Admin", "Player"],
    },
  },
];

const WHO_COLORS = {
  Admin: { bg: "rgba(0,229,255,0.1)", border: "rgba(0,229,255,0.25)", text: CYAN },
  Player: { bg: "rgba(109,40,217,0.1)", border: "rgba(109,40,217,0.3)", text: "#A78BFA" },
};

export default function PlatformFeatures() {
  const [active, setActive] = useState(null);

  const selected = features.find((f) => f.id === active);

  return (
    <section className="py-24 px-6" style={{ background: "#0A0E27" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-14">
          <div
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(0,229,255,0.08)",
              border: "1px solid rgba(0,229,255,0.2)",
              color: CYAN,
              fontFamily: "IBM Plex Mono, monospace",
            }}
          >
            Platform Overview
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA", letterSpacing: "-0.02em" }}
          >
            Everything you need to compete
          </h2>
          <p className="text-lg max-w-2xl" style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}>
            Click any feature to learn how it works.
          </p>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-0">
          {features.map((f) => {
            const isActive = active === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActive(isActive ? null : f.id)}
                className="text-left rounded-lg p-5 transition-all duration-200"
                style={{
                  background: isActive
                    ? "rgba(0,229,255,0.08)"
                    : "rgba(15,23,42,0.8)",
                  border: isActive
                    ? `1px solid ${f.detail && f.tagColor ? f.tagColor : CYAN}60`
                    : "1px solid rgba(75,85,99,0.2)",
                  transform: isActive ? "translateY(-2px)" : "translateY(0)",
                  boxShadow: isActive ? `0 8px 24px rgba(0,0,0,0.4)` : "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "rgba(0,229,255,0.25)";
                    e.currentTarget.style.background = "rgba(0,229,255,0.04)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "rgba(75,85,99,0.2)";
                    e.currentTarget.style.background = "rgba(15,23,42,0.8)";
                  }
                }}
              >
                {/* Icon */}
                <div className="text-2xl mb-3">{f.icon}</div>

                {/* Tag */}
                <div
                  className="inline-block text-xs font-semibold tracking-widest uppercase px-2 py-0.5 rounded mb-2"
                  style={{
                    background: `${f.tagColor}12`,
                    border: `1px solid ${f.tagColor}30`,
                    color: f.tagColor,
                    fontFamily: "IBM Plex Mono, monospace",
                  }}
                >
                  {f.tag}
                </div>

                {/* Title */}
                <div
                  className="font-semibold text-sm leading-tight mb-1"
                  style={{ color: isActive ? "#F8F9FA" : "#D1D5DB", fontFamily: "Inter, sans-serif" }}
                >
                  {f.title}
                </div>

                {/* Summary */}
                <div className="text-xs leading-relaxed" style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}>
                  {f.summary}
                </div>

                {/* Expand indicator */}
                <div
                  className="mt-3 text-xs font-medium"
                  style={{
                    color: isActive ? CYAN : "#4B5563",
                    fontFamily: "IBM Plex Mono, monospace",
                    transition: "color 0.2s",
                  }}
                >
                  {isActive ? "▲ collapse" : "▼ learn more"}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail panel — shown below the grid when a card is selected */}
        {selected && (
          <div
            className="mt-3 rounded-lg p-8"
            style={{
              background: "rgba(15,23,42,0.95)",
              border: `1px solid ${selected.tagColor}30`,
              borderTop: `2px solid ${selected.tagColor}`,
              animation: "fadeInUp 0.2s ease-out both",
            }}
          >
            {/* Panel header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{selected.icon}</span>
                <div>
                  <div
                    className="text-xl font-bold mb-1"
                    style={{ color: "#F8F9FA", fontFamily: "Poppins, sans-serif" }}
                  >
                    {selected.title}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {selected.detail.who.map((role) => (
                      <span
                        key={role}
                        className="text-xs font-semibold px-2 py-0.5 rounded"
                        style={{
                          background: WHO_COLORS[role].bg,
                          border: `1px solid ${WHO_COLORS[role].border}`,
                          color: WHO_COLORS[role].text,
                          fontFamily: "IBM Plex Mono, monospace",
                        }}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActive(null)}
                className="text-sm px-3 py-1.5 rounded transition-all"
                style={{
                  background: "rgba(75,85,99,0.2)",
                  border: "1px solid rgba(75,85,99,0.3)",
                  color: "#9CA3AF",
                  fontFamily: "IBM Plex Mono, monospace",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F8F9FA")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
              >
                ✕ close
              </button>
            </div>

            {/* Two-column layout */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Description */}
              <div>
                <div
                  className="text-xs font-semibold tracking-widest uppercase mb-3"
                  style={{ color: "#6B7280", fontFamily: "IBM Plex Mono, monospace" }}
                >
                  How it works
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif", lineHeight: 1.8 }}
                >
                  {selected.detail.description}
                </p>
              </div>

              {/* Highlights */}
              <div>
                <div
                  className="text-xs font-semibold tracking-widest uppercase mb-3"
                  style={{ color: "#6B7280", fontFamily: "IBM Plex Mono, monospace" }}
                >
                  Key capabilities
                </div>
                <ul className="space-y-2">
                  {selected.detail.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
                      <span
                        className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-xs"
                        style={{
                          background: `${selected.tagColor}15`,
                          border: `1px solid ${selected.tagColor}40`,
                          color: selected.tagColor,
                        }}
                      >
                        ✓
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
