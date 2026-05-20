import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { getEventsByUserId } from "../../redux/features/eventsSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../utils/Loading/Loading";

const TournamentCard = ({ tournament }) => {
  const event = tournament?.eventId;
  return (
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
      <Link to={`/registereventuser/${event?._id}`} className="block relative" style={{ height: 200 }}>
        <img
          src={`${process.env.REACT_APP_BACKEND}/${event?.image}`}
          alt={event?.title}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(10,14,39,0.95) 0%, transparent 60%)" }}
        />
        <div
          className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{
            background: "rgba(16,185,129,0.15)",
            border: "1px solid rgba(16,185,129,0.35)",
            color: "#10B981",
            fontFamily: "IBM Plex Mono, monospace",
          }}
        >
          REGISTERED
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3
            className="text-base font-semibold"
            style={{ color: "#F8F9FA", fontFamily: "Inter, sans-serif" }}
          >
            {event?.title}
          </h3>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/registereventuser/${event?._id}`}>
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: "#00E5FF", fontFamily: "IBM Plex Mono, monospace" }}
          >
            {event?.game}
            {event?.gameMode && (
              <span style={{ color: "#9CA3AF" }}> · {event.gameMode.charAt(0).toUpperCase() + event.gameMode.slice(1)}</span>
            )}
          </p>
          <p
            className="text-sm line-clamp-2 mb-3"
            style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}
          >
            {event?.description}
          </p>
          <p
            className="text-sm font-bold"
            style={{ color: "#FF7A00", fontFamily: "IBM Plex Mono, monospace" }}
          >
            PKR {event?.prizePool}
          </p>
        </Link>
      </div>
    </div>
  );
};

const RegisteredEvents = () => {
  const dispatch = useDispatch();
  const { participants, loading } = useSelector((state) => state.events);
  const userId = JSON.parse(localStorage.getItem("user"))?.UserId;

  useEffect(() => {
    if (userId) dispatch(getEventsByUserId(userId));
  }, [dispatch, userId]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <h2
        className="text-2xl font-bold"
        style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
      >
        Registered Events
      </h2>

      {participants.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl"
          style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(75,85,99,0.2)", color: "#9CA3AF" }}
        >
          You haven't registered for any events yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {participants.map((tournament, index) => (
            <TournamentCard key={index} tournament={tournament} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RegisteredEvents;
