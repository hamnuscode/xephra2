import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createEvent } from "../../redux/features/eventsSlice";
import Loading from "../../utils/Loading/Loading";

const inputClass = "input-field w-full";

const NewEvents = ({ setActiveMenu }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.events);
  const [formData, setFormData] = useState({
    title: "",
    game: "",
    gameMode: "",
    date: "",
    time: "",
    description: "",
    image: null,
    prizePool: "",
    rules: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => { if (v !== null) fd.append(k, v); });
    const adminId = JSON.parse(localStorage.getItem("user"))?.UserId;
    if (adminId) fd.append("adminId", adminId);
    dispatch(createEvent(fd));
    setFormData({ title: "", game: "", gameMode: "", date: "", time: "", description: "", image: null, prizePool: "", rules: "" });
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto">
      <h2
        className="text-2xl font-bold mb-6"
        style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
      >
        Create New Tournament
      </h2>

      <div
        className="rounded-xl p-6"
        style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(75,85,99,0.2)" }}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="form-label">Tournament Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter tournament title"
                required
              />
            </div>
            <div>
              <label className="form-label">Game</label>
              <input
                type="text"
                name="game"
                value={formData.game}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. PUBG, Free Fire"
                required
              />
            </div>
            <div>
              <label className="form-label">Game Mode</label>
              <select
                name="gameMode"
                value={formData.gameMode}
                onChange={handleChange}
                className={inputClass}
                required
                style={{ background: "rgba(15,23,42,0.9)", color: "#F8F9FA", border: "1px solid rgba(75,85,99,0.3)", borderRadius: 8, padding: "10px 12px" }}
              >
                <option value="" style={{ background: "#0A0E27" }}>Select Game Mode</option>
                <option value="solo" style={{ background: "#0A0E27" }}>Solo</option>
                <option value="duo" style={{ background: "#0A0E27" }}>Duo</option>
                <option value="squad" style={{ background: "#0A0E27" }}>Squad</option>
              </select>
            </div>
            <div>
              <label className="form-label">Prize Pool</label>
              <input
                type="text"
                name="prizePool"
                value={formData.prizePool}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 50000"
                required
              />
            </div>
            <div>
              <label className="form-label">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="form-label">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={inputClass}
              rows={4}
              placeholder="Describe the tournament..."
              required
            />
          </div>

          <div>
            <label className="form-label">Rules</label>
            <textarea
              name="rules"
              value={formData.rules}
              onChange={handleChange}
              className={inputClass}
              rows={3}
              placeholder="Enter tournament rules..."
              required
            />
          </div>

          <div>
            <label className="form-label">Tournament Banner</label>
            <div
              className="relative rounded-lg overflow-hidden"
              style={{ border: "1px dashed rgba(0,229,255,0.25)", background: "rgba(0,229,255,0.03)", padding: "12px 16px" }}
            >
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                required
                style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif", fontSize: 13 }}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm" style={{ color: "#EF4444", fontFamily: "Inter, sans-serif" }}>
              {error?.error || error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveMenu("postedEvents")}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: "rgba(75,85,99,0.15)",
                border: "1px solid rgba(75,85,99,0.25)",
                color: "#9CA3AF",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 py-2.5 text-sm">
              Create Tournament
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewEvents;
