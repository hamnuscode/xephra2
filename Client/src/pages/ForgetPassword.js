import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { forgotPassword } from "../redux/features/authSlice";
import Loading from "../utils/Loading/Loading";
import { Link } from "react-router-dom";
import logo from "../assets/xephra logo-01.png";

const ForgetPassword = () => {
  const dispatch = useDispatch();
  const { message, error, loading } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }));
    setEmail("");
    setAcceptTerms(false);
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
      <div
        className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(109,40,217,0.08) 0%, transparent 70%)" }}
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
              Forgot Password?
            </h2>
            <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
              Enter your email and we'll send you reset instructions.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="input-field"
                required
              />
            </div>

            <div className="flex items-start gap-3">
              <div className="relative mt-0.5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                  required
                  className="sr-only"
                />
                <div
                  onClick={() => setAcceptTerms(!acceptTerms)}
                  className="w-5 h-5 rounded cursor-pointer flex items-center justify-center transition-all duration-150"
                  style={{
                    background: acceptTerms ? "#00E5FF" : "rgba(75,85,99,0.15)",
                    border: acceptTerms ? "none" : "2px solid #4B5563",
                  }}
                >
                  {acceptTerms && (
                    <svg className="w-3 h-3" fill="none" stroke="#0A0E27" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <label
                htmlFor="terms"
                className="text-sm cursor-pointer"
                style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}
                onClick={() => setAcceptTerms(!acceptTerms)}
              >
                I accept the{" "}
                <span className="transition-colors" style={{ color: "#00E5FF" }}>
                  Terms and Conditions
                </span>
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
              Send Reset Instructions
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

export default ForgetPassword;
