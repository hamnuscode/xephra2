import React from "react";

const Modal = ({ isOpen, onClose, profile }) => {
  const baseUrl = process.env.REACT_APP_BACKEND;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-6 w-full max-w-lg"
        style={{
          background: "#0A0E27",
          border: "1px solid rgba(0,229,255,0.2)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
          >
            Gamer Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "#9CA3AF" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F8F9FA")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <img
              src={`${baseUrl}/${profile?.data?.profileImage}`}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover flex-shrink-0"
              style={{ border: "2px solid rgba(0,229,255,0.3)" }}
            />
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
              >
                {profile?.data?.name}
              </h3>
              <p
                className="text-sm"
                style={{ color: "#00E5FF", fontFamily: "IBM Plex Mono, monospace" }}
              >
                @{profile?.data?.username}
              </p>
            </div>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-lg p-4"
            style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(75,85,99,0.15)" }}
          >
            {[
              ["Full Name", profile?.data?.fullName],
              ["Bio", profile?.data?.bio],
              ["Email", profile?.data?.email],
              ["Age", profile?.data?.age],
              ["Address", profile?.data?.address],
              ["City", profile?.data?.locationCity],
              ["Country", profile?.data?.locationCountry],
              ["Phone", profile?.data?.phoneNumber],
            ].map(([label, value]) => (
              <div key={label}>
                <span
                  className="text-xs"
                  style={{ color: "#6B7280", fontFamily: "IBM Plex Mono, monospace" }}
                >
                  {label}
                </span>
                <p
                  className="text-sm font-medium mt-0.5"
                  style={{ color: "#F8F9FA", fontFamily: "Inter, sans-serif" }}
                >
                  {value || "—"}
                </p>
              </div>
            ))}
          </div>

          <button onClick={onClose} className="btn-primary w-full py-2.5 text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
