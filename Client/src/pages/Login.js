import React, { useState } from "react";
import { LoginUser, resendVerificationEmail } from "../redux/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../utils/Loading/Loading";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../assets/xephra logo-01.png";

const Login = () => {
  const { loading, error, message } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const HandleFormSubmit = (e) => {
    e.preventDefault();
    dispatch(LoginUser(formData)).then((action) => {
      if (LoginUser.fulfilled.match(action)) {
        if (action?.payload?.user?.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/userdashboard");
        }
      } else if (LoginUser.rejected.match(action)) {
        if (action?.payload?.needsVerification) {
          setShowVerificationMessage(true);
        }
      }
    });
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      toast.error("Please enter your email address first");
      return;
    }
    setResendLoading(true);
    dispatch(resendVerificationEmail(formData.email)).then((action) => {
      setResendLoading(false);
      if (resendVerificationEmail.fulfilled.match(action)) {
        toast.success("Verification email sent! Please check your inbox.");
      }
    });
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://api.xephra.net/auth/google";
  };

  if (loading) return <Loading />;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0A0E27 0%, #0d1340 50%, #0A0E27 100%)" }}
    >
      {/* Background glow effects */}
      <div
        className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(109,40,217,0.08) 0%, transparent 70%)" }}
      />

      <div className="w-full max-w-sm relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/">
            <img src={logo} alt="Xephra" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Card */}
        <div
          className="rounded-lg p-8"
          style={{
            background: "rgba(15, 23, 42, 0.95)",
            border: "1px solid rgba(0, 229, 255, 0.15)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          }}
        >
          <h2
            className="text-2xl font-bold text-center mb-2"
            style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
          >
            Welcome Back
          </h2>
          <p className="text-center text-sm mb-8" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
            Sign in to your account
          </p>

          <form className="space-y-5" onSubmit={HandleFormSubmit}>
            <div>
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="input-field"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full text-base">
              Sign In
            </button>
          </form>

          {/* Error state */}
          {error && (
            <div className="mt-4 space-y-2">
              <p className="text-sm" style={{ color: "#EF4444", fontFamily: "Inter, sans-serif" }}>
                {error?.error}
              </p>
              {showVerificationMessage && (
                <div
                  className="p-4 rounded-lg text-sm"
                  style={{
                    background: "rgba(245, 158, 11, 0.08)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    color: "#F59E0B",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  <p className="mb-2">Your email is not verified. Check your inbox or resend the verification email.</p>
                  <button
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    className="btn-ghost text-sm px-0 py-0 hover:underline"
                  >
                    {resendLoading ? "Sending..." : "Resend Verification Email"}
                  </button>
                </div>
              )}
            </div>
          )}

          {message && !error && (
            <p className="text-sm mt-3" style={{ color: "#10B981", fontFamily: "Inter, sans-serif" }}>
              {message}
            </p>
          )}

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow" style={{ borderTop: "1px solid rgba(75,85,99,0.3)" }} />
            <span className="px-3 text-sm" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>OR</span>
            <div className="flex-grow" style={{ borderTop: "1px solid rgba(75,85,99,0.3)" }} />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-150"
            style={{
              background: "rgba(75,85,99,0.15)",
              border: "1px solid rgba(75,85,99,0.3)",
              color: "#F8F9FA",
              fontFamily: "Inter, sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(75,85,99,0.25)";
              e.currentTarget.style.borderColor = "rgba(0,229,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(75,85,99,0.15)";
              e.currentTarget.style.borderColor = "rgba(75,85,99,0.3)";
            }}
          >
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="mt-6 space-y-2 text-center">
            <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
              <Link
                to="/forget"
                className="transition-colors duration-150"
                style={{ color: "#00E5FF" }}
                onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              >
                Forgot Password?
              </Link>
            </p>
            <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium transition-colors duration-150"
                style={{ color: "#00E5FF" }}
                onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
