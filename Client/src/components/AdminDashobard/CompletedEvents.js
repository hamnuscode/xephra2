import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchHostedTournaments } from "../../redux/features/eventsSlice";
import Loading from "../../utils/Loading/Loading";

const CompletedEvents = () => {
  const dispatch = useDispatch();
  const { hostedEvents, loading, error } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchHostedTournaments());
  }, [dispatch]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <h2
        className="text-2xl font-bold"
        style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
      >
        Completed Events
      </h2>

      {error && (
        <p className="text-sm" style={{ color: "#EF4444" }}>Error: {error}</p>
      )}

      {hostedEvents.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl"
          style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(75,85,99,0.2)", color: "#9CA3AF" }}
        >
          No completed events yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostedEvents.map((tournament) => (
            <TournamentCard key={tournament._id} {...tournament} />
          ))}
        </div>
      )}
    </div>
  );
};

function TournamentCard({ _id, title, game, gameMode, date, time, description, image, prizePool }) {
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
      <Link to={`/eventadmin/${_id}`} className="block relative" style={{ height: 200 }}>
        <img
          src={`${process.env.REACT_APP_BACKEND}/${image}`}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(10,14,39,0.95) 0%, transparent 60%)" }}
        />
        <div
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{
            background: "rgba(109,40,217,0.15)",
            border: "1px solid rgba(109,40,217,0.4)",
            color: "#6D28D9",
            fontFamily: "IBM Plex Mono, monospace",
          }}
        >
          COMPLETED
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3
            className="text-base font-semibold"
            style={{ color: "#F8F9FA", fontFamily: "Inter, sans-serif" }}
          >
            {title}
          </h3>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/eventadmin/${_id}`}>
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: "#00E5FF", fontFamily: "IBM Plex Mono, monospace" }}
          >
            {game}
            {gameMode && (
              <span style={{ color: "#9CA3AF" }}> · {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}</span>
            )}
          </p>
          <p
            className="text-xs mb-2"
            style={{ color: "#9CA3AF", fontFamily: "IBM Plex Mono, monospace" }}
          >
            {date} {time && `· ${time}`}
          </p>
          <p
            className="text-sm line-clamp-2 mb-3"
            style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}
          >
            {description}
          </p>
          <p
            className="text-sm font-bold mb-3"
            style={{ color: "#FF7A00", fontFamily: "IBM Plex Mono, monospace" }}
          >
            PKR {prizePool}
          </p>
        </Link>
        <div className="flex justify-center">
          <Link
            to={`/dashboard/tournamentrankings/${_id}`}
            className="btn-primary px-5 py-2 text-sm"
          >
            Users Ranking
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CompletedEvents;
