import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchHostedTournaments } from "../../redux/features/eventsSlice";
import Loading from "../../utils/Loading/Loading";

const RankingApproval = () => {
  const dispatch = useDispatch();
  const { hostedEvents, loading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchHostedTournaments());
  }, [dispatch]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <h1
        className="text-2xl font-bold"
        style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
      >
        Admin Approval Panel
      </h1>

      {hostedEvents.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl"
          style={{
            background: "rgba(15,23,42,0.6)",
            border: "1px solid rgba(75,85,99,0.2)",
            color: "#9CA3AF",
            fontFamily: "Inter, sans-serif",
          }}
        >
          No completed tournaments to review.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {hostedEvents.map((event) => (
            <Link
              key={event._id}
              to={`/dashboard/tournamentrankingapproval/${event._id}`}
              className="relative rounded-lg overflow-hidden group transition-all duration-200"
              style={{ aspectRatio: "3/4" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.04)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,229,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <img
                src={`${process.env.REACT_APP_BACKEND}/${event.image}`}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: "rgba(10,14,39,0.55)" }}
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ border: "1px solid rgba(0,229,255,0.5)", borderRadius: 8 }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <p
                  className="text-xs font-semibold text-center"
                  style={{ color: "#F8F9FA", fontFamily: "Inter, sans-serif" }}
                >
                  {event.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RankingApproval;
