import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getEvents } from "../../redux/features/eventsSlice";
import Loading from "../../utils/Loading/Loading";

const UpcomingTournaments = () => {
  const dispatch = useDispatch();
  const { loading, events, event } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch, event]);

  const API_BASE_URL = process.env.REACT_APP_BACKEND;

  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <section className="py-24 px-6" style={{ background: "#0A0E27" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(109, 40, 217, 0.08)",
              border: "1px solid rgba(109, 40, 217, 0.25)",
              color: "#6D28D9",
              fontFamily: "IBM Plex Mono, monospace",
            }}
          >
            Live Competitions
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA", letterSpacing: "-0.02em" }}
          >
            Upcoming Tournaments
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
            Join active tournaments and compete for real prizes.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loading />
          </div>
        ) : sortedEvents.length === 0 ? (
          <div
            className="text-center py-16 rounded-lg"
            style={{
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(0, 229, 255, 0.1)",
              color: "#9CA3AF",
              fontFamily: "Inter, sans-serif",
            }}
          >
            <svg className="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-base">No upcoming tournaments at this time. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {sortedEvents.map((ev) => (
              <div
                key={ev._id}
                className="group relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200"
                style={{ aspectRatio: "3/4" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.04)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(109,40,217,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
                }}
              >
                <img
                  src={`${API_BASE_URL}/${ev.image}`}
                  alt={ev.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.style.background = "rgba(15,23,42,0.95)";
                  }}
                />
                {/* Gradient */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(10,14,39,0.98) 0%, rgba(10,14,39,0.3) 60%, transparent 100%)",
                  }}
                />
                {/* Purple hover border */}
                <div
                  className="absolute inset-0 rounded-lg border opacity-0 group-hover:opacity-100 transition-all duration-200"
                  style={{ border: "1px solid rgba(109,40,217,0.6)" }}
                />
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  {ev.date && (
                    <p
                      className="text-xs mb-1"
                      style={{ color: "#00E5FF", fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      {new Date(ev.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  )}
                  <h3
                    className="text-sm font-semibold leading-tight"
                    style={{ color: "#F8F9FA", fontFamily: "Inter, sans-serif" }}
                  >
                    {ev.title}
                  </h3>
                </div>

                {/* Live badge */}
                {ev.status === "active" && (
                  <div
                    className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      background: "rgba(16, 185, 129, 0.15)",
                      border: "1px solid rgba(16, 185, 129, 0.4)",
                      color: "#10B981",
                      fontFamily: "IBM Plex Mono, monospace",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                    LIVE
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingTournaments;
