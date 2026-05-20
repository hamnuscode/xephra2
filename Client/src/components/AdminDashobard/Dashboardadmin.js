import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
  ArcElement,
  BarElement,
} from "chart.js";
import { Link } from "react-router-dom";
import { getEvents, fetchHostedTournaments } from "../../redux/features/eventsSlice";
import {
  getAllUsers,
  deleteUser,
  suspendUser,
  getUser,
} from "../../redux/features/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import { getTopRanking } from "../../redux/features/rankingSlice";
import { gettotaluserandevents } from "../../redux/features/profileSlice";
import toast from "react-hot-toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors
);

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

const DashboardAdmin = ({ setActiveMenu }) => {
  const dispatch = useDispatch();
  const { events, hostedEvents } = useSelector((state) => state.events);
  const { users, profile } = useSelector((state) => state.profile);
  const { topranks } = useSelector((state) => state.ranking);
  const { userCount, eventCount, error, loading } = useSelector((state) => state.profile);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    dispatch(getEvents());
    dispatch(getAllUsers());
    dispatch(getTopRanking());
    dispatch(gettotaluserandevents());
    dispatch(fetchHostedTournaments());
  }, []);

  useEffect(() => {
    if (error && !loading) toast.error(error);
  }, [error, loading]);

  const maxWeightedScore = Math.max(...(Array.isArray(topranks) ? topranks : []).map((u) => u.weightedScore), 1);

  const analyticsData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Total Events",
        data: eventCount.length > 0 ? eventCount.slice(0, 6) : [0, 0, 0, 0, 0, 0],
        borderColor: "#00E5FF",
        backgroundColor: "rgba(0,229,255,0.05)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#00E5FF",
        pointRadius: 4,
      },
      {
        label: "Active Users",
        data: userCount.length > 0 ? userCount.slice(0, 6) : [0, 0, 0, 0, 0, 0],
        borderColor: "#6D28D9",
        backgroundColor: "rgba(109,40,217,0.05)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#6D28D9",
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#9CA3AF", fontFamily: "IBM Plex Mono, monospace" } },
    },
    scales: {
      x: {
        ticks: { color: "#9CA3AF" },
        grid: { color: "rgba(75,85,99,0.15)" },
      },
      y: {
        ticks: { color: "#9CA3AF" },
        grid: { color: "rgba(75,85,99,0.15)" },
      },
    },
  };

  const handleDelete = (user) => { setUserToDelete(user); setShowDeleteModal(true); };
  const cancelDelete = () => { setShowDeleteModal(false); setUserToDelete(null); };
  const confirmDelete = () => {
    if (!userToDelete) return;
    const t = toast.loading("Deleting user...");
    dispatch(deleteUser(userToDelete.userId)).then((result) => {
      toast.dismiss(t);
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("User deleted successfully!");
        setShowDeleteModal(false);
        setUserToDelete(null);
      }
    });
  };
  const handleSuspend = (user) => {
    const t = toast.loading(user.isSuspended ? "Unsuspending..." : "Suspending...");
    dispatch(suspendUser(user.userId)).then((result) => {
      toast.dismiss(t);
      if (result.meta.requestStatus === "fulfilled")
        toast.success(user.isSuspended ? "User unsuspended!" : "User suspended!");
    });
  };
  const handleProfileView = (userId) => { dispatch(getUser(userId)); setIsModalOpen(true); };

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
          className="text-4xl font-bold mb-2"
          style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
        >
          Welcome, Admin
        </h1>
        <p style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
          Manage and monitor all gaming events and rankings efficiently.
        </p>
      </div>

      {/* Analytics */}
      <div
        className="rounded-xl p-6"
        style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(75,85,99,0.2)" }}
      >
        <h2
          className="text-xl font-bold mb-5"
          style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
        >
          Analytics & Stats
        </h2>
        <div style={{ height: 280 }}>
          <Line data={analyticsData} options={chartOptions} />
        </div>
      </div>

      {/* Events + Rankings */}
      <div className="grid grid-cols-12 gap-6">
        {/* Events */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          <div
            className="rounded-xl p-6"
            style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(75,85,99,0.2)" }}
          >
            <h2
              className="text-lg font-bold mb-4"
              style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
            >
              Posted Events
            </h2>
            {events.length === 0 ? (
              <p style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>No events posted yet.</p>
            ) : (
              <Slider {...sliderSettings(events.length)}>
                {events.map((event) => (
                  <Link to={`/eventadmin/${event._id}`} key={event._id} className="block p-1">
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

          <div
            className="rounded-xl p-6"
            style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(75,85,99,0.2)" }}
          >
            <h2
              className="text-lg font-bold mb-4"
              style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
            >
              Completed Events
            </h2>
            {hostedEvents.length === 0 ? (
              <p style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>No completed events.</p>
            ) : (
              <Slider {...sliderSettings(hostedEvents.length)}>
                {hostedEvents.map((event) => (
                  <Link to={`/eventadmin/${event._id}`} key={event._id} className="block p-1">
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
            to="/dashboard/allranking"
            className="btn-primary mt-4 block text-center py-2 text-sm"
          >
            See All
          </Link>
        </div>
      </div>

      {/* User Management */}
      <div
        className="rounded-xl p-6"
        style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(75,85,99,0.2)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
          >
            Manage Users
          </h2>
          <Link
            to="/dashboard/users"
            className="text-sm font-medium"
            style={{ color: "#00E5FF", fontFamily: "Inter, sans-serif" }}
          >
            See All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(75,85,99,0.2)" }}>
                {["Name", "Email", "Role", "Created At", "Profile", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="pb-3 text-left text-xs font-semibold uppercase tracking-wider pr-4"
                    style={{ color: "#6B7280", fontFamily: "IBM Plex Mono, monospace" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 3).map((user) => (
                <tr
                  key={user._id}
                  className="transition-colors"
                  style={{ borderBottom: "1px solid rgba(75,85,99,0.1)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,229,255,0.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="py-3 pr-4 text-sm" style={{ color: "#F8F9FA", fontFamily: "Inter, sans-serif" }}>{user.name}</td>
                  <td className="py-3 pr-4 text-sm" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>{user.email}</td>
                  <td className="py-3 pr-4 text-sm" style={{ color: "#9CA3AF" }}>{user.role}</td>
                  <td className="py-3 pr-4 text-xs" style={{ color: "#9CA3AF", fontFamily: "IBM Plex Mono, monospace" }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-4">
                    <button
                      onClick={() => handleProfileView(user.userId)}
                      className="text-xs px-3 py-1.5 rounded-md transition-colors"
                      style={{
                        background: "rgba(0,229,255,0.08)",
                        border: "1px solid rgba(0,229,255,0.2)",
                        color: "#00E5FF",
                        fontFamily: "Inter, sans-serif",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,229,255,0.15)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,229,255,0.08)")}
                    >
                      View
                    </button>
                  </td>
                  <td className="py-3 pr-4">
                    <button
                      onClick={() => handleSuspend(user)}
                      className="text-xs px-3 py-1.5 rounded-md transition-colors"
                      style={{
                        background: user.isSuspended ? "rgba(16,185,129,0.08)" : "rgba(255,122,0,0.08)",
                        border: user.isSuspended ? "1px solid rgba(16,185,129,0.25)" : "1px solid rgba(255,122,0,0.25)",
                        color: user.isSuspended ? "#10B981" : "#FF7A00",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {user.isSuspended ? "Unsuspend" : "Suspend"}
                    </button>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => handleDelete(user)}
                      className="text-xs px-3 py-1.5 rounded-md transition-colors"
                      style={{
                        background: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.2)",
                        color: "#EF4444",
                        fontFamily: "Inter, sans-serif",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div
          className="modal-backdrop"
          onClick={cancelDelete}
        >
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="text-xl font-bold mb-3"
              style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
            >
              Confirm Deletion
            </h2>
            <p className="mb-2" style={{ color: "#F8F9FA", fontFamily: "Inter, sans-serif" }}>
              Delete <strong>"{userToDelete.name}"</strong>?
            </p>
            <p className="text-sm mb-6" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  background: "rgba(75,85,99,0.2)",
                  border: "1px solid rgba(75,85,99,0.3)",
                  color: "#9CA3AF",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  background: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#EF4444",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} profile={profile} />
    </div>
  );
};

export default DashboardAdmin;
