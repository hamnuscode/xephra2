import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchHostedTournaments } from "../../redux/features/eventsSlice";
import {
  postRankingApproval,
  fetchUserSubmissions,
  deleteUserSubmission,
} from "../../redux/features/rankingSlice";
import { getSubscriptionStatus } from "../../redux/features/paymentSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../utils/Loading/Loading";
import toast from "react-hot-toast";

const selectStyle = {
  background: "rgba(10,14,39,0.8)",
  border: "1px solid rgba(75,85,99,0.3)",
  color: "#F8F9FA",
  borderRadius: 6,
  padding: "8px 10px",
  width: "100%",
  fontFamily: "Inter, sans-serif",
  fontSize: 13,
  outline: "none",
};

const cellInputStyle = {
  background: "rgba(10,14,39,0.8)",
  border: "1px solid rgba(75,85,99,0.3)",
  color: "#F8F9FA",
  borderRadius: 6,
  padding: "6px 10px",
  width: "100%",
  fontFamily: "Inter, sans-serif",
  fontSize: 13,
  outline: "none",
};

const RankingApproval = () => {
  const dispatch = useDispatch();
  const { loading, hostedEvents } = useSelector((state) => state.events);
  const { data, error, submissions } = useSelector((state) => state.ranking);
  const { subscriptionStatus } = useSelector((state) => state.payment);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.UserId;

  useEffect(() => {
    if (userId) dispatch(getSubscriptionStatus(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    dispatch(fetchHostedTournaments());
  }, [dispatch]);

  useEffect(() => {
    if (userId) dispatch(fetchUserSubmissions(userId));
  }, [dispatch, userId, data]);

  const [game, setGame] = useState({
    userId,
    eventId: "",
    gameName: "",
    rank: "",
    score: "",
    status: "-",
    screenshot: null,
  });

  const handleInputChange = (field, value) => setGame((p) => ({ ...p, [field]: value }));
  const handleScreenshotUpload = (file) => setGame((p) => ({ ...p, screenshot: file }));

  const handleSubmit = () => {
    if (!subscriptionStatus?.isActive) {
      toast.error("You need an active subscription to submit game entries.");
      return;
    }
    setGame((p) => ({ ...p, status: "Pending" }));
    dispatch(postRankingApproval(game));
    setGame({ userId, eventId: "", gameName: "", rank: "", score: "", status: "-", screenshot: null });
  };

  const handleDelete = (userId, eventId) => dispatch(deleteUserSubmission({ userId, eventId }));

  if (loading || subscriptionStatus?.loading) return <Loading />;

  if (!subscriptionStatus?.isActive) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}>
          User Game Entry
        </h1>
        <div
          className="rounded-xl p-8 text-center max-w-md mx-auto"
          style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(75,85,99,0.2)" }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.2)" }}
          >
            <svg className="w-8 h-8" fill="none" stroke="#00E5FF" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}>
            Subscription Required
          </h3>
          <p className="mb-6 text-sm" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
            You need an active subscription to submit game entries and participate in tournaments.
          </p>
          <ul className="text-sm mb-6 space-y-1 text-left" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
            {["Submit game rankings", "Join tournaments", "View detailed statistics", "Access premium features"].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span style={{ color: "#00E5FF" }}>·</span> {f}
              </li>
            ))}
          </ul>
          <Link to="/paymentportal" className="btn-primary block py-2.5 text-sm">
            Activate Subscription
          </Link>
        </div>
      </div>
    );
  }

  const thStyle = {
    padding: "10px 12px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#6B7280",
    fontFamily: "IBM Plex Mono, monospace",
    borderBottom: "1px solid rgba(75,85,99,0.2)",
    whiteSpace: "nowrap",
  };

  const tdStyle = {
    padding: "10px 12px",
    verticalAlign: "top",
    borderBottom: "1px solid rgba(75,85,99,0.1)",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}>
        User Game Entry
      </h1>

      {/* Entry Form Table */}
      <div
        className="rounded-xl p-5 overflow-x-auto"
        style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(75,85,99,0.2)" }}
      >
        <h2 className="text-base font-semibold mb-4" style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}>
          Submit New Entry
        </h2>
        <table className="w-full min-w-[700px]">
          <thead>
            <tr>
              {["Game Name", "Rank", "Score", "Screenshot", "Status", "Action"].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>
                <select
                  onChange={(e) => {
                    const ev = hostedEvents.find((x) => x._id === e.target.value);
                    if (ev) setGame((p) => ({ ...p, eventId: ev._id, gameName: ev.title }));
                  }}
                  value={game.eventId}
                  style={selectStyle}
                >
                  <option value="" disabled style={{ background: "#0A0E27" }}>Select event</option>
                  {hostedEvents.map((ev) => (
                    <option key={ev._id} value={ev._id} style={{ background: "#0A0E27" }}>{ev.title}</option>
                  ))}
                </select>
              </td>
              <td style={tdStyle}>
                <input
                  type="number"
                  value={game.rank}
                  onChange={(e) => handleInputChange("rank", e.target.value)}
                  style={cellInputStyle}
                  placeholder="Rank"
                  disabled={game.status !== "-"}
                />
              </td>
              <td style={tdStyle}>
                <input
                  type="number"
                  value={game.score}
                  onChange={(e) => handleInputChange("score", e.target.value)}
                  style={cellInputStyle}
                  placeholder="Score"
                  disabled={game.status !== "-"}
                />
              </td>
              <td style={tdStyle}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleScreenshotUpload(e.target.files[0])}
                  disabled={game.status !== "-"}
                  style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif", fontSize: 12 }}
                />
                {game.screenshot && (
                  <img
                    src={URL.createObjectURL(game.screenshot)}
                    alt="Preview"
                    className="mt-2 w-16 h-16 object-cover rounded"
                    style={{ border: "1px solid rgba(75,85,99,0.3)" }}
                  />
                )}
              </td>
              <td style={tdStyle}>
                <span
                  className="text-xs font-semibold"
                  style={{
                    color: game.status === "Pending" ? "#FF7A00" : "#6B7280",
                    fontFamily: "IBM Plex Mono, monospace",
                  }}
                >
                  {game.status}
                </span>
              </td>
              <td style={tdStyle}>
                {game.status === "-" ? (
                  <button
                    onClick={handleSubmit}
                    className="btn-primary px-4 py-1.5 text-xs"
                  >
                    Submit
                  </button>
                ) : (
                  <span className="text-xs font-semibold" style={{ color: "#10B981" }}>Submitted</span>
                )}
                {error && <p className="text-xs mt-1" style={{ color: "#EF4444" }}>{error?.message}</p>}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Submissions */}
      {submissions.length === 0 && !loading ? (
        <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>No submissions found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {submissions.map((submission) => (
            <div
              key={submission._id}
              className="rounded-xl overflow-hidden"
              style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(75,85,99,0.2)" }}
            >
              {submission.screenshot && (
                <img
                  src={`${process.env.REACT_APP_BACKEND}/${submission.screenshot}`}
                  alt="Screenshot"
                  className="w-full h-36 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-3" style={{ color: "#F8F9FA", fontFamily: "Inter, sans-serif" }}>
                  {submission.gameName}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs mb-3" style={{ color: "#9CA3AF", fontFamily: "IBM Plex Mono, monospace" }}>
                  <p>Rank: <span style={{ color: "#F8F9FA" }}>{submission.rank}</span></p>
                  <p>Score: <span style={{ color: "#F8F9FA" }}>{submission.score}</span></p>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={
                      submission.status === "Approved"
                        ? { background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981" }
                        : submission.status === "Pending"
                        ? { background: "rgba(255,122,0,0.1)", border: "1px solid rgba(255,122,0,0.3)", color: "#FF7A00" }
                        : { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444" }
                    }
                  >
                    {submission.status}
                  </span>
                  <button
                    onClick={() => handleDelete(submission.userId, submission.eventId)}
                    className="text-xs px-3 py-1 rounded-md transition-colors"
                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RankingApproval;
