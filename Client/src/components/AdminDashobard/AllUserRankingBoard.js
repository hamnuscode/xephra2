import React, { useEffect, useState } from "react";
import { fetchUserStats } from "../../redux/features/rankingSlice";
import { getUser } from "../../redux/features/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../utils/Loading/Loading";
import Modal from "./Modal";

const AllUserRankingBoard = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.ranking);
  const { profile } = useSelector((state) => state.profile);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUserStats());
  }, [dispatch]);

  const userData = users?.result || null;

  const handleProfileView = (userId) => {
    dispatch(getUser(userId));
    setIsModalOpen(true);
  };

  if (loading) return <Loading />;

  const maxScore = userData ? Math.max(...userData.map((u) => u.weightedScore || 0), 1) : 1;

  const medalColor = (i) => {
    if (i === 0) return "#FFD700";
    if (i === 1) return "#C0C0C0";
    if (i === 2) return "#CD7F32";
    return "#00E5FF";
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: "#0A0E27", fontFamily: "Inter, sans-serif" }}
    >
      {/* Header */}
      <div className="mb-8">
        <div
          className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
          style={{
            background: "rgba(0,229,255,0.08)",
            border: "1px solid rgba(0,229,255,0.2)",
            color: "#00E5FF",
            fontFamily: "IBM Plex Mono, monospace",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#00E5FF",
              display: "inline-block",
              animation: "pulseGlow 2s ease-in-out infinite",
            }}
          />
          Live Rankings
        </div>
        <h1
          className="text-3xl font-bold"
          style={{ color: "#F8F9FA", fontFamily: "Poppins, sans-serif", letterSpacing: "-0.02em" }}
        >
          Rival Users Ranking Board
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          All-time leaderboard based on weighted tournament scores
        </p>
      </div>

      {/* Table header */}
      <div
        className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 mb-2 rounded-md text-xs font-semibold tracking-widest uppercase"
        style={{
          color: "#6B7280",
          fontFamily: "IBM Plex Mono, monospace",
          borderBottom: "1px solid rgba(75,85,99,0.2)",
        }}
      >
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-5">Player</div>
        <div className="col-span-4">Score Progress</div>
        <div className="col-span-1 text-right">Pts</div>
        <div className="col-span-1 text-right">Action</div>
      </div>

      {/* Player rows */}
      <div className="space-y-2">
        {userData && userData.map((item, ind) => {
          const progress = (item.weightedScore / maxScore) * 100;
          const color = medalColor(ind);

          return (
            <div
              key={item._id}
              className="grid grid-cols-12 gap-4 items-center px-4 py-4 rounded-lg transition-all duration-150"
              style={{
                background: ind < 3
                  ? `rgba(0,229,255,0.04)`
                  : "rgba(15,23,42,0.6)",
                border: ind < 3
                  ? `1px solid rgba(0,229,255,0.12)`
                  : "1px solid rgba(75,85,99,0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,229,255,0.25)";
                e.currentTarget.style.background = "rgba(0,229,255,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = ind < 3
                  ? "rgba(0,229,255,0.12)"
                  : "rgba(75,85,99,0.15)";
                e.currentTarget.style.background = ind < 3
                  ? "rgba(0,229,255,0.04)"
                  : "rgba(15,23,42,0.6)";
              }}
            >
              {/* Rank */}
              <div className="col-span-1 text-center">
                <span
                  className="text-lg font-bold"
                  style={{ color, fontFamily: "IBM Plex Mono, monospace" }}
                >
                  {ind < 3 ? ["🥇", "🥈", "🥉"][ind] : `#${ind + 1}`}
                </span>
              </div>

              {/* Player info */}
              <div className="col-span-5 flex items-center gap-3">
                <img
                  src={
                    item?.userProfile?.profileImage
                      ? `${process.env.REACT_APP_BACKEND}/${item.userProfile.profileImage}`
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvyKxD07vzVrTXqVFK0myyV8KT99ZWBNNwGA&s"
                  }
                  alt={item?.userProfile?.fullName}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  style={{ border: `2px solid ${color}40` }}
                />
                <div>
                  <div className="font-semibold text-sm" style={{ color: "#F8F9FA" }}>
                    {item?.userProfile?.fullName || "Unknown Player"}
                  </div>
                  <div className="text-xs" style={{ color: "#6B7280" }}>
                    Rank {ind + 1}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="col-span-4">
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "rgba(75,85,99,0.3)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${progress}%`,
                      background: `linear-gradient(90deg, ${color}, ${color}99)`,
                    }}
                  />
                </div>
                <div className="text-xs mt-1" style={{ color: "#6B7280", fontFamily: "IBM Plex Mono, monospace" }}>
                  {Math.round(progress)}%
                </div>
              </div>

              {/* Score */}
              <div className="col-span-1 text-right">
                <span
                  className="text-sm font-bold"
                  style={{ color, fontFamily: "IBM Plex Mono, monospace" }}
                >
                  {item?.weightedScore ?? 0}
                </span>
              </div>

              {/* Action */}
              <div className="col-span-1 text-right">
                <button
                  onClick={() => handleProfileView(item?.userId)}
                  className="text-xs px-2 py-1 rounded transition-all duration-150"
                  style={{
                    background: "rgba(0,229,255,0.08)",
                    border: "1px solid rgba(0,229,255,0.2)",
                    color: "#00E5FF",
                    fontFamily: "IBM Plex Mono, monospace",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,229,255,0.15)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,229,255,0.08)")}
                >
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {!userData || userData.length === 0 ? (
        <div
          className="text-center py-16"
          style={{ color: "#6B7280", fontFamily: "IBM Plex Mono, monospace" }}
        >
          No ranking data available yet.
        </div>
      ) : null}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} profile={profile} />
    </div>
  );
};

export default AllUserRankingBoard;
