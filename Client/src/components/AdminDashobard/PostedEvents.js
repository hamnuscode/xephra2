import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { getEvents, deleteEventById, editEvent } from "../../redux/features/eventsSlice";
import Loading from "../../utils/Loading/Loading";
import toast from "react-hot-toast";

const inputStyle = {
  background: "rgba(15,23,42,0.8)",
  border: "1px solid rgba(75,85,99,0.3)",
  color: "#F8F9FA",
  borderRadius: 8,
  padding: "8px 12px",
  width: "100%",
  fontFamily: "Inter, sans-serif",
  fontSize: 14,
  outline: "none",
};

const labelStyle = {
  color: "#9CA3AF",
  fontFamily: "Inter, sans-serif",
  fontSize: 13,
  marginBottom: 4,
  display: "block",
};

const PostedEvents = ({ setActiveMenu }) => {
  const dispatch = useDispatch();
  const { loading, error, events, message, event } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch, event]);

  useEffect(() => {
    if (message && !loading) toast.success(message);
    if (error && !loading) toast.error(error);
  }, [message, error, loading]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  const DeleteEvent = (tournament) => { setEventToDelete(tournament); setShowDeleteModal(true); };
  const cancelDelete = () => { setShowDeleteModal(false); setEventToDelete(null); };
  const confirmDelete = () => {
    if (!eventToDelete) return;
    const t = toast.loading("Deleting event...");
    dispatch(deleteEventById(eventToDelete._id)).then((result) => {
      toast.dismiss(t);
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Event deleted!");
        setShowDeleteModal(false);
        setEventToDelete(null);
      }
    });
  };

  const onEdit = (tournament) => { setSelectedTournament(tournament); setShowEditModal(true); };
  const saveEdit = (updated) => {
    const t = toast.loading("Updating event...");
    dispatch(editEvent({ id: updated._id, updatedData: updated })).then((result) => {
      toast.dismiss(t);
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Event updated!");
        setShowEditModal(false);
        setSelectedTournament(null);
      }
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
        >
          Posted Events
        </h2>
        <button
          onClick={() => setActiveMenu("newEvents")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
          style={{
            background: "rgba(0,229,255,0.08)",
            border: "1px solid rgba(0,229,255,0.25)",
            color: "#00E5FF",
            fontFamily: "Inter, sans-serif",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,229,255,0.15)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,229,255,0.08)")}
        >
          <FaPlus className="w-3 h-3" /> New Event
        </button>
      </div>

      {/* Grid */}
      {sortedEvents.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl"
          style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(75,85,99,0.2)", color: "#9CA3AF" }}
        >
          No events posted yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map((tournament) => (
            <TournamentCard
              key={tournament._id}
              {...tournament}
              onEdit={onEdit}
              onDelete={DeleteEvent}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedTournament && (
        <div
          className="modal-backdrop"
          onClick={() => { setShowEditModal(false); setSelectedTournament(null); }}
        >
          <div
            className="rounded-xl p-6 w-full max-w-lg overflow-y-auto"
            style={{
              background: "#0A0E27",
              border: "1px solid rgba(0,229,255,0.2)",
              maxHeight: "90vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="text-xl font-bold mb-5"
              style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
            >
              Edit Tournament
            </h2>
            <form
              onSubmit={(e) => { e.preventDefault(); saveEdit(selectedTournament); }}
              className="space-y-4"
            >
              {[
                { label: "Title", key: "title", type: "text" },
                { label: "Game", key: "game", type: "text" },
                { label: "Date", key: "date", type: "date" },
                { label: "Time", key: "time", type: "time" },
                { label: "Prize Pool", key: "prizePool", type: "text" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    type={type}
                    value={selectedTournament[key] || ""}
                    onChange={(e) => setSelectedTournament((p) => ({ ...p, [key]: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              ))}
              {["description", "rules"].map((key) => (
                <div key={key}>
                  <label style={labelStyle}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  <textarea
                    rows={3}
                    value={selectedTournament[key] || ""}
                    onChange={(e) => setSelectedTournament((p) => ({ ...p, [key]: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              ))}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setSelectedTournament(null); }}
                  className="px-4 py-2 rounded-lg text-sm"
                  style={{ background: "rgba(75,85,99,0.2)", border: "1px solid rgba(75,85,99,0.3)", color: "#9CA3AF" }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-6 py-2 text-sm">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && eventToDelete && (
        <div className="modal-backdrop" onClick={cancelDelete}>
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
              Delete <strong>"{eventToDelete.title}"</strong>?
            </p>
            <p className="text-sm mb-6" style={{ color: "#9CA3AF" }}>This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg text-sm"
                style={{ background: "rgba(75,85,99,0.2)", border: "1px solid rgba(75,85,99,0.3)", color: "#9CA3AF" }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg text-sm"
                style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function TournamentCard({ _id, title, game, gameMode, date, time, description, image, prizePool, rules, onEdit, onDelete }) {
  const imageUrl = `${process.env.REACT_APP_BACKEND}/${image}`;
  return (
    <div
      className="rounded-xl overflow-hidden transition-transform duration-200"
      style={{
        background: "rgba(15,23,42,0.9)",
        border: "1px solid rgba(75,85,99,0.2)",
      }}
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
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(10,14,39,0.95) 0%, transparent 60%)" }}
        />
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
            {date && new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            {time && ` · ${time}`}
          </p>
          <p
            className="text-sm line-clamp-2 mb-3"
            style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}
          >
            {description}
          </p>
        </Link>
        <div className="flex items-center justify-between">
          <span
            className="text-sm font-bold"
            style={{ color: "#FF7A00", fontFamily: "IBM Plex Mono, monospace" }}
          >
            PKR {prizePool}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit({ _id, title, game, gameMode, date, time, description, image, prizePool, rules })}
              className="p-2 rounded-md transition-colors"
              style={{ color: "#9CA3AF" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00E5FF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
            >
              <FaEdit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete({ _id, title, game, date, time, description, image, prizePool, rules })}
              className="p-2 rounded-md transition-colors"
              style={{ color: "#9CA3AF" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#EF4444")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
            >
              <FaTrash className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostedEvents;
