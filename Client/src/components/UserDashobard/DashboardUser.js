import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { useSelector, useDispatch } from "react-redux";
import { getEvents, getEventsByUserId } from "../../redux/features/eventsSlice";
import Loading from "../../utils/Loading/Loading";
import { getTopRanking } from "../../redux/features/rankingSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { checkUserProfile } from "../../redux/features/userSlice";

const sliderSettings = (count) => ({
  dots: false,
  infinite: count >= 3,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: count >= 3,
  autoplaySpeed: 3000,
  responsive: [
    { breakpoint: 1200, settings: { slidesToShow: Math.min(2, count), slidesToScroll: 1 } },
    { breakpoint: 450, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
});

const DashboardUser = ({ setActiveMenu }) => {
  const dispatch = useDispatch();
  const { loading, events, event, participants } = useSelector((state) => state.events);
  const { profileExists } = useSelector((state) => state.user);
  const { topranks } = useSelector((state) => state.ranking);

  const userId = JSON.parse(localStorage.getItem("user"))?.UserId;

  useEffect(() => {
    dispatch(getEvents());
    if (userId) dispatch(getEventsByUserId(userId));
  }, [dispatch, event]);

  useEffect(() => {
    if (userId) dispatch(checkUserProfile(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (profileExists === false) {
      toast.warn("Your profile is not set up yet. Please complete your profile.", {
        position: "top-right",
        autoClose: false,
      });
    }
  }, [profileExists]);

  useEffect(() => {
    dispatch(getTopRanking());
  }, []);

  const sortedUpcomingEvents = [...(Array.isArray(events) ? events : [])].sort((a, b) => new Date(a.date) - new Date(b.date));
  const sortedRegisteredEvents = [...(Array.isArray(participants) ? participants : [])].sort((a, b) => new Date(a.date) - new Date(b.date));
  const maxWeightedScore = Math.max(...(Array.isArray(topranks) ? topranks : []).map((u) => u.weightedScore), 1);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div
        className="rounded-xl p-8"
        style={{
          background: "#111827",
          border: "1px solid rgba(0,229,255,0.12)",
        }}
      >
        <h1
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
        >
          Welcome to the Gaming Dashboard
        </h1>
        <p style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
          Stay updated with upcoming events and your ranking progress.
        </p>
      </div>

      {/* Events + Rankings */}
      <div className="grid grid-cols-12 gap-6">
        {/* Events */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {/* Upcoming Events */}
          <div
            className="rounded-xl p-6"
            style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(75,85,99,0.2)" }}
          >
            <h2
              className="text-lg font-bold mb-4"
              style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
            >
              Upcoming Events
            </h2>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loading />
              </div>
            ) : sortedUpcomingEvents.length === 0 ? (
              <p style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>No upcoming events.</p>
            ) : (
              <Slider {...sliderSettings(sortedUpcomingEvents.length)}>
                {sortedUpcomingEvents.map((event) => (
                  <Link to={`/eventuser/${event._id}`} key={event._id} className="block p-1">
                    <div
                      className="relative rounded-lg overflow-hidden transition-transform duration-200"
                      style={{ height: 200 }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        {event.date && (
                          <p
                            className="text-xs mb-1"
                            style={{ color: "#00E5FF", fontFamily: "IBM Plex Mono, monospace" }}
                          >
                            {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                        )}
                        <h3
                          className="text-sm font-semibold"
                          style={{ color: "#F8F9FA", fontFamily: "Inter, sans-serif" }}
                        >
                          {event.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </Slider>
            )}
          </div>

          {/* Registered Events */}
          <div
            className="rounded-xl p-6"
            style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(75,85,99,0.2)" }}
          >
            <h2
              className="text-lg font-bold mb-4"
              style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
            >
              Registered Events
            </h2>
            {sortedRegisteredEvents.length === 0 ? (
              <p style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>No registered events yet.</p>
            ) : (
              <Slider {...sliderSettings(sortedRegisteredEvents.length)}>
                {sortedRegisteredEvents.map((event) => (
                  <Link
                    to={`/eventuser/${event?.eventId?._id}`}
                    key={event?.eventId?._id}
                    className="block p-1"
                  >
                    <div
                      className="relative rounded-lg overflow-hidden transition-transform duration-200"
                      style={{ height: 200 }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      <img
                        src={`${process.env.REACT_APP_BACKEND}/${event?.eventId?.image}`}
                        alt={event?.eventId?.title}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0"
                        style={{ background: "rgba(10,14,39,0.55)" }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3
                          className="text-sm font-semibold"
                          style={{ color: "#F8F9FA", fontFamily: "Inter, sans-serif" }}
                        >
                          {event?.eventId?.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </Slider>
            )}
          </div>
        </div>

        {/* Rankings */}
        <div
          className="col-span-12 lg:col-span-3 rounded-xl p-5 flex flex-col"
          style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(75,85,99,0.2)" }}
        >
          <h2
            className="text-lg font-bold mb-4"
            style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
          >
            User Rankings
          </h2>
          <ul className="flex-1 space-y-4">
            {topranks.length > 0 ? (
              topranks.map((user, index) => {
                const progress = (user.weightedScore / maxWeightedScore) * 100;
                return (
                  <li key={user.id} className="flex items-center gap-3">
                    <img
                      src={`${process.env.REACT_APP_BACKEND}/${user?.userProfile?.profileImage}`}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      style={{ border: "1px solid rgba(0,229,255,0.2)" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p
                          className="text-xs font-semibold truncate"
                          style={{ color: "#F8F9FA", fontFamily: "Inter, sans-serif" }}
                        >
                          {user?.userProfile?.fullName}
                        </p>
                        <span
                          className="text-xs flex-shrink-0 ml-1"
                          style={{ color: "#00E5FF", fontFamily: "IBM Plex Mono, monospace" }}
                        >
                          #{index + 1}
                        </span>
                      </div>
                      <div
                        className="w-full h-1.5 rounded-full overflow-hidden"
                        style={{ background: "rgba(75,85,99,0.3)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${progress}%`,
                            background: "#00E5FF",
                          }}
                        />
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <p style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif", fontSize: 13 }}>
                No rankings yet.
              </p>
            )}
          </ul>
          <Link
            to="/userdashboard/allranking"
            className="btn-primary mt-4 block text-center py-2 text-sm"
          >
            See All
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardUser;
