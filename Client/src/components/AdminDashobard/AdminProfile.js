import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCamera, FaUser, FaEnvelope, FaCity } from "react-icons/fa";
import { updateProfile, createProfile, getProfile } from "../../redux/features/profileSlice";
import Loading from "../../utils/Loading/Loading";

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

const AdminProfile = ({ profile }) => {
  const { loading } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.UserId;

  const [profileData, setProfileData] = useState({
    userId: userId,
    profileImage: null,
    username: "",
    fullName: "",
    bio: "",
    email: "",
    locationCity: "",
    locationCountry: "",
    phoneNumber: "",
    address: "",
  });
  const [profileImageView, setProfileImageView] = useState(null);
  const [initialProfileData, setInitialProfileData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (userId) dispatch(getProfile(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (profile) {
      setProfileData((prev) => ({ ...prev, ...profile, profileImage: profile.profileImage || prev.profileImage }));
      setInitialProfileData(profile);
    }
  }, [profile]);

  const handleChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileData({ ...profileData, profileImage: URL.createObjectURL(file) });
    setSelectedFile(file);
    setProfileImageView(URL.createObjectURL(file));
  };

  const buildFormData = () => {
    const fd = new FormData();
    if (selectedFile) fd.append("profileImage", selectedFile);
    ["userId", "username", "fullName", "bio", "email", "locationCity", "locationCountry", "phoneNumber", "address"].forEach(
      (k) => fd.append(k, profileData[k] || "")
    );
    return fd;
  };

  const handleCreate = () => dispatch(createProfile(buildFormData())).then(() => dispatch(getProfile(userId)));

  const handleUpdate = () =>
    dispatch(updateProfile({ userId: profileData.userId, formData: buildFormData() })).then(() => dispatch(getProfile(userId)));

  const isProfileChanged = () =>
    initialProfileData && Object.keys(profileData).some((k) => initialProfileData[k] !== profileData[k]);

  const handleProfileUpdateClick = () => {
    if (!isProfileChanged()) {
      setMessage("No changes detected.");
    } else {
      setMessage("");
      handleUpdate();
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Banner + Avatar */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{ background: "#111827", border: "1px solid #1E2A3A", paddingBottom: 60 }}
      >
        {/* Banner area */}
        <div
          className="h-32 w-full"
          style={{ background: "#0D1424", borderBottom: "1px solid #1E2A3A" }}
        />

        {/* Avatar */}
        <div className="absolute bottom-0 left-6 transform translate-y-1/2">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full overflow-hidden"
              style={{ border: "3px solid rgba(0,229,255,0.4)", background: "#0A0E27" }}
            >
              <img
                src={
                  profileImageView
                    ? profileImageView
                    : profileData?.profileImage
                    ? `${apiUrl}/${profileData.profileImage}`
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvyKxD07vzVrTXqVFK0myyV8KT99ZWBNNwGA&s"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <label
              htmlFor="profileImage"
              className="absolute bottom-0 right-0 p-1.5 rounded-full cursor-pointer transition-colors"
              style={{ background: "rgba(0,229,255,0.15)", border: "1px solid rgba(0,229,255,0.3)" }}
            >
              <FaCamera className="w-3 h-3" style={{ color: "#00E5FF" }} />
              <input type="file" id="profileImage" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
            </label>
          </div>
        </div>

        {/* Username on banner */}
        <div className="absolute bottom-3 left-36 ml-2">
          <p
            className="text-lg font-bold"
            style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
          >
            {profileData.username || "Admin"}
          </p>
          <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
            {profileData.bio || ""}
          </p>
        </div>
      </div>

      {/* Form */}
      <div
        className="rounded-xl p-6"
        style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(75,85,99,0.2)" }}
      >
        <h2
          className="text-lg font-bold mb-5"
          style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
        >
          Profile Information
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}><FaUser className="w-3 h-3" /> Username</label>
              <input type="text" name="username" value={profileData.username || ""} onChange={handleChange} style={fieldStyle} placeholder="Enter username" />
            </div>
            <div>
              <label style={labelStyle}><FaUser className="w-3 h-3" /> Full Name</label>
              <input type="text" name="fullName" value={profileData.fullName || ""} onChange={handleChange} style={fieldStyle} placeholder="Enter full name" />
            </div>
          </div>

          <div>
            <label style={labelStyle}><FaEnvelope className="w-3 h-3" /> Bio</label>
            <textarea name="bio" value={profileData.bio || ""} onChange={handleChange} rows={3} style={fieldStyle} placeholder="Tell us about yourself..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}><FaEnvelope className="w-3 h-3" /> Email</label>
              <input type="email" name="email" value={profileData.email || ""} onChange={handleChange} style={fieldStyle} placeholder="Enter email" />
            </div>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input type="text" name="phoneNumber" value={profileData.phoneNumber || ""} onChange={handleChange} style={fieldStyle} placeholder="Enter phone number" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}><FaCity className="w-3 h-3" /> City</label>
              <input type="text" name="locationCity" value={profileData.locationCity || ""} onChange={handleChange} style={fieldStyle} placeholder="Enter city" />
            </div>
            <div>
              <label style={labelStyle}><FaCity className="w-3 h-3" /> Country</label>
              <input type="text" name="locationCountry" value={profileData.locationCountry || ""} onChange={handleChange} style={fieldStyle} placeholder="Enter country" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Address</label>
            <input type="text" name="address" value={profileData.address || ""} onChange={handleChange} style={fieldStyle} placeholder="Enter address" />
          </div>
        </div>

        {message && (
          <p
            className="mt-4 text-sm text-center"
            style={{ color: "#FF7A00", fontFamily: "Inter, sans-serif" }}
          >
            {message}
          </p>
        )}

        <div className="flex justify-center mt-6">
          {profile ? (
            <button onClick={handleProfileUpdateClick} className="btn-primary px-10 py-2.5">
              Update Profile
            </button>
          ) : (
            <button onClick={handleCreate} className="btn-primary px-10 py-2.5">
              Create Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
