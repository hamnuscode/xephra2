import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getEvents, joinEvent, saveTeamData, getEventsByUserId, clearError } from "../../redux/features/eventsSlice";
import { getSubscriptionStatus } from "../../redux/features/paymentSlice";
import Loading from "../../utils/Loading/Loading";
import toast from "react-hot-toast";

const inputStyle = {
  width: "100%",
  padding: "8px 12px",
  background: "rgba(10,14,39,0.8)",
  border: "1px solid rgba(75,85,99,0.4)",
  borderRadius: 6,
  color: "#F8F9FA",
  fontFamily: "Inter, sans-serif",
  fontSize: 13,
  outline: "none",
};

const disabledInputStyle = {
  ...inputStyle,
  color: "#6B7280",
  cursor: "not-allowed",
  borderColor: "rgba(75,85,99,0.2)",
};

const TournamentCard = ({ _id, title, game, gameMode, date, time, description, image, prizePool, isUserRegistered }) => {
  const { loading } = useSelector((state) => state.events);
  const [showTeamPopup, setShowTeamPopup] = useState(false);
  const [teamType, setTeamType] = useState("solo");
  const [teamName, setTeamName] = useState("");
  const [leaderInfo, setLeaderInfo] = useState({ xephraId: "", gamerId: "", gamerTag: "", phoneNumber: "" });
  const [teamMembers, setTeamMembers] = useState([
    { xephraId: "", gamerId: "", gamerTag: "", phoneNumber: "" },
    { xephraId: "", gamerId: "", gamerTag: "", phoneNumber: "" },
    { xephraId: "", gamerId: "", gamerTag: "", phoneNumber: "" },
  ]);
  const [validationLoading, setValidationLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const dispatch = useDispatch();

  const getUserData = () => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } };
  const user = getUserData();
  const userId = user?.UserId;
  const userXephraId = userId;

  useEffect(() => {
    if (userId) dispatch(getSubscriptionStatus(userId));
  }, [dispatch, userId]);

  const handleJoin = async () => {
    if (!userId) { toast.error("User is not logged in"); return; }
    if (isUserRegistered) { toast.error("You have already joined this event!"); return; }

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND}/payments/validate-team-subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xephraIds: [userXephraId] }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) { toast.error("Failed to validate subscription. Please try again."); return; }
      if (result.inactiveMembers?.includes(userXephraId)) {
        toast.error(`Your subscription is not active. Please activate your subscription to join events.`);
        return;
      }
    } catch { toast.error("Failed to validate subscription. Please try again."); return; }

    setTeamType(gameMode?.toLowerCase() || "solo");
    setShowTeamPopup(true);
  };

  const handleTeamJoin = async () => {
    setValidationError("");

    let teamData = {
      teamType,
      teamName,
      leaderInfo: { ...leaderInfo, xephraId: userXephraId },
      teamMembers: [],
    };

    if (teamType === "duo" || teamType === "squad") {
      if (!teamName.trim()) { setValidationError("Team name is required."); return; }
      if (teamType === "duo") {
        const m = teamMembers[0];
        if (!m.xephraId.trim() || !m.gamerId.trim() || !m.gamerTag.trim()) {
          setValidationError("Duo requires 2 members. All fields are mandatory.");
          return;
        }
      }
      if (teamType === "squad") {
        for (let i = 0; i < 3; i++) {
          const m = teamMembers[i];
          if (!m.xephraId.trim() || !m.gamerId.trim() || !m.gamerTag.trim()) {
            setValidationError(`Incomplete details for Member ${i + 2}. All fields are mandatory.`);
            return;
          }
        }
      }
    }

    if (!leaderInfo.gamerId.trim() || !leaderInfo.gamerTag.trim() || !leaderInfo.phoneNumber.trim()) {
      setValidationError("Your Gamer ID, Gamer Tag, and Phone Number are required.");
      return;
    }

    teamData.teamMembers = teamType === "duo" ? [teamMembers[0]] : teamType === "squad" ? teamMembers.slice(0, 3) : [];

    setValidationLoading(true);
    try {
      const allIds = [userXephraId, ...teamData.teamMembers.filter((m) => m.xephraId.trim()).map((m) => m.xephraId.trim())];
      const res = await fetch(`${process.env.REACT_APP_BACKEND}/payments/validate-team-subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xephraIds: allIds }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) { setValidationError(result.message || "Failed to validate subscriptions"); setValidationLoading(false); return; }
      if (result.inactiveMembers?.length > 0) {
        setValidationError(`Inactive subscriptions: ${result.inactiveMembers.join(", ")}`);
        setValidationLoading(false);
        return;
      }
    } catch { setValidationError("Failed to validate subscriptions. Please try again."); setValidationLoading(false); return; }

    setValidationLoading(false);

    const joinResult = await dispatch(joinEvent({ userId, eventId: _id }));
    if (joinEvent.fulfilled.match(joinResult)) {
      const teamResult = await dispatch(saveTeamData({ userId, eventId: _id, teamData }));
      if (saveTeamData.fulfilled.match(teamResult)) {
        toast.success("Team registration successful!");
        dispatch(getEventsByUserId(userId));
      } else {
        const msg = teamResult.payload?.message || "Failed to save team data";
        setValidationError(msg); toast.error(msg); setValidationLoading(false); return;
      }
    } else {
      const msg = joinResult.payload?.message || "Failed to join event";
      setValidationError(msg); toast.error(msg); setValidationLoading(false); return;
    }

    closeTeamPopup();
  };

  const resetForm = () => {
    setTeamType(gameMode?.toLowerCase() || "solo");
    setTeamName("");
    setLeaderInfo({ xephraId: "", gamerId: "", gamerTag: "", phoneNumber: "" });
    setTeamMembers([
      { xephraId: "", gamerId: "", gamerTag: "", phoneNumber: "" },
      { xephraId: "", gamerId: "", gamerTag: "", phoneNumber: "" },
      { xephraId: "", gamerId: "", gamerTag: "", phoneNumber: "" },
    ]);
    setValidationError("");
  };

  const closeTeamPopup = () => { setShowTeamPopup(false); resetForm(); };

  const handleTeamMemberChange = (index, field, value) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const handleLeaderInfoChange = (field, value) => setLeaderInfo((p) => ({ ...p, [field]: value }));

  const MemberForm = ({ label, isLeader = false, memberIndex = null }) => (
    <div
      className="p-4 rounded-lg space-y-2"
      style={{ background: "rgba(10,14,39,0.6)", border: "1px solid rgba(75,85,99,0.3)" }}
    >
      <p
        className="text-xs font-semibold mb-2"
        style={{ color: "#00E5FF", fontFamily: "IBM Plex Mono, monospace" }}
      >
        {label}
      </p>
      {[
        { ph: isLeader ? `Xephra ID: ${userXephraId}` : "Xephra ID", field: "xephraId", disabled: isLeader },
        { ph: "Gamer ID", field: "gamerId" },
        { ph: "Gamer Tag", field: "gamerTag" },
        ...(teamType !== "duo" && memberIndex === null ? [{ ph: "Phone Number", field: "phoneNumber" }] :
           isLeader ? [{ ph: "Phone Number", field: "phoneNumber" }] : []),
      ].map(({ ph, field, disabled }) => (
        <input
          key={field}
          type="text"
          placeholder={ph}
          disabled={disabled}
          value={isLeader ? (disabled ? userXephraId : leaderInfo[field]) : teamMembers[memberIndex]?.[field] || ""}
          onChange={(e) =>
            isLeader ? handleLeaderInfoChange(field, e.target.value) : handleTeamMemberChange(memberIndex, field, e.target.value)
          }
          style={disabled ? disabledInputStyle : inputStyle}
        />
      ))}
    </div>
  );

  return (
    <>
      <div
        className="rounded-xl overflow-hidden transition-transform duration-200"
        style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(75,85,99,0.2)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.borderColor = "rgba(0,229,255,0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = "rgba(75,85,99,0.2)";
        }}
      >
        <Link to={`/eventuser/${_id}`} className="block relative" style={{ height: 200 }}>
          <img
            src={`${process.env.REACT_APP_BACKEND}/${image}`}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: "rgba(10,14,39,0.55)" }}
          />
          {date && (
            <div
              className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs"
              style={{ color: "#00E5FF", fontFamily: "IBM Plex Mono, monospace", background: "rgba(0,229,255,0.1)" }}
            >
              {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-base font-semibold" style={{ color: "#F8F9FA", fontFamily: "Inter, sans-serif" }}>
              {title}
            </h3>
          </div>
        </Link>
        <div className="p-4">
          <Link to={`/eventuser/${_id}`}>
            <p className="text-sm font-semibold mb-1" style={{ color: "#00E5FF", fontFamily: "IBM Plex Mono, monospace" }}>
              {game}
              {gameMode && <span style={{ color: "#9CA3AF" }}> · {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}</span>}
            </p>
            <p className="text-sm line-clamp-2 mb-2" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
              {description}
            </p>
            <p className="text-sm font-bold mb-3" style={{ color: "#FF7A00", fontFamily: "IBM Plex Mono, monospace" }}>
              PKR {prizePool}
            </p>
          </Link>
          <div className="flex justify-center">
            {isUserRegistered ? (
              <button
                disabled
                className="w-full py-2.5 rounded-lg text-sm font-medium cursor-not-allowed"
                style={{
                  background: "rgba(75,85,99,0.15)",
                  border: "1px solid rgba(75,85,99,0.2)",
                  color: "#6B7280",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Already Joined
              </button>
            ) : (
              <button
                disabled={loading}
                onClick={handleJoin}
                className="btn-primary w-full py-2.5 text-sm"
              >
                {loading ? "Joining..." : "Join Now"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Team Selection Modal */}
      {showTeamPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)" }}
          onClick={closeTeamPopup}
        >
          <div
            className="rounded-xl p-6 w-full max-w-2xl overflow-y-auto"
            style={{
              background: "#0A0E27",
              border: "1px solid rgba(0,229,255,0.2)",
              maxHeight: "90vh",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-bold" style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}>
                  Join Tournament
                </h3>
                <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
                  {title} · <span style={{ color: "#00E5FF" }}>{game}</span>
                </p>
              </div>
              <button
                onClick={closeTeamPopup}
                className="p-2 rounded-lg"
                style={{ color: "#9CA3AF" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F8F9FA")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Team Type Selector */}
            <div className="flex gap-3 mb-5">
              {["solo", "duo", "squad"].map((type) => {
                const disabled = gameMode?.toLowerCase() !== type;
                return (
                  <button
                    key={type}
                    disabled={disabled}
                    onClick={() => !disabled && setTeamType(type)}
                    className="flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all"
                    style={
                      teamType === type
                        ? { background: "rgba(0,229,255,0.12)", border: "1px solid rgba(0,229,255,0.4)", color: "#00E5FF" }
                        : disabled
                        ? { background: "rgba(75,85,99,0.08)", border: "1px solid rgba(75,85,99,0.15)", color: "#4B5563", cursor: "not-allowed" }
                        : { background: "rgba(75,85,99,0.12)", border: "1px solid rgba(75,85,99,0.25)", color: "#9CA3AF" }
                    }
                  >
                    {type}
                  </button>
                );
              })}
            </div>

            {/* Team Name (duo/squad) */}
            {(teamType === "duo" || teamType === "squad") && (
              <div className="mb-4">
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
                  Team Name
                </label>
                <input
                  type="text"
                  placeholder="Enter team name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  style={inputStyle}
                />
              </div>
            )}

            {/* Member Forms */}
            <div className={`grid gap-4 mb-5 ${teamType !== "solo" ? "md:grid-cols-2" : "grid-cols-1"}`}>
              <MemberForm label={teamType === "squad" ? "Squad Leader (You)" : "Team Leader (You)"} isLeader />
              {teamType === "duo" && <MemberForm label="Team Member 2" memberIndex={0} />}
              {teamType === "squad" && [0, 1, 2].map((i) => (
                <MemberForm key={i} label={`Squad Member ${i + 2}`} memberIndex={i} />
              ))}
            </div>

            {/* Validation Error */}
            {validationError && (
              <div
                className="mb-4 p-3 rounded-lg text-sm"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  color: "#EF4444",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {validationError}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={closeTeamPopup}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium"
                style={{
                  background: "rgba(75,85,99,0.15)",
                  border: "1px solid rgba(75,85,99,0.25)",
                  color: "#9CA3AF",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleTeamJoin}
                disabled={validationLoading || loading}
                className="btn-primary flex-1 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {validationLoading ? "Validating..." : loading ? "Joining..." : "Confirm & Join"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const UpcomingEvents = () => {
  const dispatch = useDispatch();
  const { loading, events, registeredEvents } = useSelector((state) => state.events);

  const isUserRegisteredForEvent = (eventId) => {
    if (!registeredEvents?.length) return false;
    return registeredEvents.some((e) => e.eventId?._id === eventId);
  };

  useEffect(() => {
    dispatch(clearError());
    dispatch(getEvents());
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.UserId) dispatch(getEventsByUserId(user.UserId));
    } catch {}
  }, [dispatch]);

  if (loading) return <Loading />;

  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="space-y-6">
      <h2
        className="text-2xl font-bold"
        style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
      >
        Upcoming Events
      </h2>

      {sortedEvents.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl"
          style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(75,85,99,0.2)", color: "#9CA3AF" }}
        >
          No upcoming events at this time.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map((tournament) => (
            <TournamentCard
              key={tournament._id}
              {...tournament}
              isUserRegistered={isUserRegisteredForEvent(tournament._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;
