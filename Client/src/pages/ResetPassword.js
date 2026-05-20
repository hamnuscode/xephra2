import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetPassword } from "../redux/features/authSlice";
import Loading from "../utils/Loading/Loading";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import toast from "react-hot-toast";
import logo from "../assets/xephra logo-01.png";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { token } = useParams();
  const dispatch = useDispatch();
  const { message, error, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    dispatch(resetPassword({ token, newPassword }));
    if (message) navigate("/dashboard");
  };

  if (loading) return <Loading />;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0A0E27 0%, #0d1340 50%, #0A0E27 100%)" }}
    >
      <div
        className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)" }}
      />

      <div className="w-full max-w-sm relative z-10 animate-fade-in">
        <div className="flex justify-center mb-8">
          <Link to="/">
            <img src={logo} alt="Xephra" className="h-10 w-auto" />
          </Link>
        </div>

        <div
          className="rounded-lg p-8"
          style={{
            background: "rgba(15, 23, 42, 0.95)",
            border: "1px solid rgba(0, 229, 255, 0.15)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="mb-6">
            <h2
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
            >
              Reset Password
            </h2>
            <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
              Enter your new password below.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="relative">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <input
                type={showNew ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="input-field pr-11"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9"
                style={{ color: "#9CA3AF" }}
                onClick={() => setShowNew(!showNew)}
                tabIndex={-1}
              >
                {showNew ? <AiFillEyeInvisible size={18} /> : <AiFillEye size={18} />}
              </button>
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type={showConfirm ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="input-field pr-11"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9"
                style={{ color: "#9CA3AF" }}
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex={-1}
              >
                {showConfirm ? <AiFillEyeInvisible size={18} /> : <AiFillEye size={18} />}
              </button>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="w-5 h-5 mt-0.5 rounded cursor-pointer flex-shrink-0 flex items-center justify-center transition-all duration-150"
                style={{
                  background: acceptTerms ? "#00E5FF" : "rgba(75,85,99,0.15)",
                  border: acceptTerms ? "none" : "2px solid #4B5563",
                }}
                onClick={() => setAcceptTerms(!acceptTerms)}
              >
                {acceptTerms && (
                  <svg className="w-3 h-3" fill="none" stroke="#0A0E27" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <label
                className="text-sm cursor-pointer"
                style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}
                onClick={() => setAcceptTerms(!acceptTerms)}
              >
                I accept the{" "}
                <span style={{ color: "#00E5FF" }}>Terms and Conditions</span>
              </label>
            </div>

            {error && (
              <p className="text-sm" style={{ color: "#EF4444", fontFamily: "Inter, sans-serif" }}>
                {typeof error === "string" ? error : "Something went wrong."}
              </p>
            )}
            {message && (
              <div
                className="p-3 rounded-lg text-sm"
                style={{
                  background: "rgba(16, 185, 129, 0.08)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  color: "#10B981",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {message}
              </div>
            )}

            <button type="submit" className="btn-primary w-full text-base">
              Reset Password
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm flex items-center justify-center gap-1.5 transition-colors duration-150"
              style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00E5FF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
