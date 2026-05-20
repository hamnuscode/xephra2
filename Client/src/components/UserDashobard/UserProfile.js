import React, { useState, useEffect } from "react";
import { FaCamera, FaUser, FaEnvelope, FaCalendarAlt, FaCity, FaGamepad, FaPhone, FaMapMarkedAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, createProfile, getProfile, fetchUserBadge } from "../../redux/features/userSlice";
import { fetchUserRank } from "../../redux/features/rankingSlice";
import Loading from "../../utils/Loading/Loading";
import RankInfo from "./RankInfo";

const apiUrl = process.env.REACT_APP_BACKEND;

const fieldStyle = {
  background: "rgba(15,23,42,0.8)",
  border: "1px solid rgba(75,85,99,0.3)",
  color: "#F8F9FA",
  borderRadius: 8,
  padding: "10px 12px",
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
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const UserProfile = ({ profile }) => {
  const { loading } = useSelector((state) => state.profile);
  const { userrank } = useSelector((state) => state.ranking);
  const { badge } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.UserId;

  useEffect(() => {
    if (userId) dispatch(fetchUserBadge(userId));
  }, [dispatch, userId]);

  const [profileData, setProfileData] = useState({
    userId,
    profileImage: null,
    username: "",
    fullName: "",
    bio: "",
    email: "",
    phoneNumber: "",
    address: "",
    age: "",
    locationCity: "",
    locationCountry: "",
    favoriteGames: [],
  });
  const [profileImageView, setProfileImageView] = useState(null);
  const [initialProfileData, setInitialProfileData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [newGame, setNewGame] = useState("");

  useEffect(() => {
    if (userId) { dispatch(getProfile(userId)); dispatch(fetchUserRank(userId)); }
  }, [dispatch, userId]);

  useEffect(() => {
    if (profile) {
      setProfileData((p) => ({ ...p, ...profile, profileImage: profile.profileImage || p.profileImage }));
      setInitialProfileData(profile);
    }
  }, [profile]);

  const handleChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setProfileImageView(URL.createObjectURL(file));
    setProfileData({ ...profileData, profileImage: URL.createObjectURL(file) });
  };

  const buildFormData = () => {
    const fd = new FormData();
    if (selectedFile) fd.append("profileImage", selectedFile);
    ["userId", "username", "fullName", "bio", "email", "locationCity", "locationCountry", "phoneNumber", "address", "age"].forEach(
      (k) => fd.append(k, profileData[k] || "")
    );
    fd.append("favoriteGames", JSON.stringify(profileData.favoriteGames));
    return fd;
  };

  const handleCreate = () => dispatch(createProfile(buildFormData())).then(() => dispatch(getProfile(userId)));
  const handleUpdate = () =>
    dispatch(updateProfile({ userId: profileData.userId, formData: buildFormData() })).then(() => dispatch(getProfile(userId)));

  const isProfileChanged = () =>
    initialProfileData && Object.keys(profileData).some((k) => String(initialProfileData[k]) !== String(profileData[k]));

  const handleProfileUpdateClick = () => {
    if (!isProfileChanged()) setMessage("No changes detected.");
    else { setMessage(""); handleUpdate(); }
  };

  const handleAddGame = () => {
    if (newGame.trim() && !profileData.favoriteGames.includes(newGame.trim())) {
      setProfileData((p) => ({ ...p, favoriteGames: [...p.favoriteGames, newGame.trim()] }));
      setNewGame("");
    }
  };

  const handleRemoveGame = (game) =>
    setProfileData((p) => ({ ...p, favoriteGames: p.favoriteGames.filter((g) => g !== game) }));

  if (loading) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Banner + Avatar */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(0,229,255,0.08) 0%, rgba(109,40,217,0.12) 100%)",
          border: "1px solid rgba(0,229,255,0.15)",
          paddingBottom: 64,
        }}
      >
        <div className="h-32 w-full" style={{ background: "linear-gradient(135deg, rgba(0,229,255,0.12) 0%, rgba(109,40,217,0.18) 100%)" }} />

        {/* Stats badges */}
        <div className="absolute top-3 right-4 flex flex-col items-end gap-1.5">
          <div
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: "rgba(0,0,0,0.4)", color: "#9CA3AF", fontFamily: "IBM Plex Mono, monospace" }}
          >
            Xephra ID: {userId || "N/A"}
          </div>
          <div
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: "rgba(0,229,255,0.15)", border: "1px solid rgba(0,229,255,0.3)", color: "#00E5FF", fontFamily: "IBM Plex Mono, monospace" }}
          >
            🏆 Rank: {userrank || "N/A"}
          </div>
          {badge && (
            <div
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: "rgba(255,122,0,0.12)", border: "1px solid rgba(255,122,0,0.3)", color: "#FF7A00", fontFamily: "IBM Plex Mono, monospace" }}
            >
              ⭐ {badge}
            </div>
          )}
          <RankInfo />
        </div>

        {/* Avatar */}
        <div className="absolute bottom-0 left-6 transform translate-y-1/2">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full overflow-hidden"
              style={{ border: "3px solid rgba(0,229,255,0.4)", background: "#0A0E27" }}
            >
              <img
                src={profileImageView || (profileData.profileImage ? `${apiUrl}/${profileData.profileImage}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvyKxD07vzVrTXqVFK0myyV8KT99ZWBNNwGA&s")}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <label
              htmlFor="profileImage"
              className="absolute bottom-0 right-0 p-1.5 rounded-full cursor-pointer"
              style={{ background: "rgba(0,229,255,0.15)", border: "1px solid rgba(0,229,255,0.3)" }}
            >
              <FaCamera className="w-3 h-3" style={{ color: "#00E5FF" }} />
              <input type="file" id="profileImage" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
            </label>
          </div>
        </div>

        <div className="absolute bottom-3 left-36 ml-2">
          <p className="text-lg font-bold" style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}>
            {profileData.username || "User"}
          </p>
          <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>{profileData.bio}</p>
        </div>
      </div>

      {/* Form */}
      <div
        className="rounded-xl p-6"
        style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(75,85,99,0.2)" }}
      >
        <h2 className="text-lg font-bold mb-5" style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}>
          Profile Information
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}><FaUser className="w-3 h-3" /> Username</label>
              <input type="text" name="username" value={profileData.username || ""} onChange={handleChange} style={fieldStyle} placeholder="Username" />
            </div>
            <div>
              <label style={labelStyle}><FaUser className="w-3 h-3" /> Full Name</label>
              <input type="text" name="fullName" value={profileData.fullName || ""} onChange={handleChange} style={fieldStyle} placeholder="Full name" />
            </div>
          </div>

          <div>
            <label style={labelStyle}><FaEnvelope className="w-3 h-3" /> Bio</label>
            <textarea name="bio" value={profileData.bio || ""} onChange={handleChange} rows={3} style={fieldStyle} placeholder="Tell us about yourself..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}><FaEnvelope className="w-3 h-3" /> Email</label>
              <input type="email" name="email" value={profileData.email || ""} onChange={handleChange} style={fieldStyle} placeholder="Email" />
            </div>
            <div>
              <label style={labelStyle}><FaPhone className="w-3 h-3" /> Phone</label>
              <input type="text" name="phoneNumber" value={profileData.phoneNumber || ""} onChange={handleChange} style={fieldStyle} placeholder="Phone number" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}><FaMapMarkedAlt className="w-3 h-3" /> Address</label>
              <input type="text" name="address" value={profileData.address || ""} onChange={handleChange} style={fieldStyle} placeholder="Address" />
            </div>
            <div>
              <label style={labelStyle}><FaCalendarAlt className="w-3 h-3" /> Age</label>
              <input type="number" name="age" value={profileData.age || ""} onChange={handleChange} style={fieldStyle} placeholder="Age" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}><FaCity className="w-3 h-3" /> City</label>
              <input type="text" name="locationCity" value={profileData.locationCity || ""} onChange={handleChange} style={fieldStyle} placeholder="City" />
            </div>
            <div>
              <label style={labelStyle}><FaCity className="w-3 h-3" /> Country</label>
              <input type="text" name="locationCountry" value={profileData.locationCountry || ""} onChange={handleChange} style={fieldStyle} placeholder="Country" />
            </div>
          </div>

          {/* Favorite Games */}
          <div>
            <label style={labelStyle}><FaGamepad className="w-3 h-3" /> Favourite Games</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newGame}
                onChange={(e) => setNewGame(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddGame()}
                style={{ ...fieldStyle, flex: 1 }}
                placeholder="Add a game..."
              />
              <button
                type="button"
                onClick={handleAddGame}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: "rgba(0,229,255,0.08)",
                  border: "1px solid rgba(0,229,255,0.25)",
                  color: "#00E5FF",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Add
              </button>
            </div>
            {profileData.favoriteGames.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profileData.favoriteGames.map((game, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                    style={{ background: "rgba(109,40,217,0.12)", border: "1px solid rgba(109,40,217,0.3)", color: "#F8F9FA", fontFamily: "Inter, sans-serif" }}
                  >
                    {game}
                    <button
                      type="button"
                      onClick={() => handleRemoveGame(game)}
                      className="text-xs"
                      style={{ color: "#9CA3AF" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#EF4444")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs" style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}>No favourite games added yet.</p>
            )}
          </div>
        </div>

        {message && (
          <p className="mt-4 text-sm text-center" style={{ color: "#FF7A00", fontFamily: "Inter, sans-serif" }}>{message}</p>
        )}

        <div className="flex justify-center mt-6">
          {profile ? (
            <button onClick={handleProfileUpdateClick} className="btn-primary px-10 py-2.5">Update Profile</button>
          ) : (
            <button onClick={handleCreate} className="btn-primary px-10 py-2.5">Create Profile</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
