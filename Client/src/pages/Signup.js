import React, { useState, useEffect } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "../redux/features/authSlice";
import Loading from "../utils/Loading/Loading";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/xephra logo-01.png";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [localMessage, setLocalMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const HandleFormSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(signUpUser(formData));
    if (result?.payload?.message) {
      setLocalMessage(result.payload.message);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = "https://api.xephra.net/auth/google";
  };

  if (loading) return <Loading />;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: "#0A0E1A" }}
    >
      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/">
            <img src={logo} alt="Rival" className="h-10 w-auto" />
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
            Create Account
          </h2>
          <p className="text-center text-sm mb-8" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
            Join the gaming arena today
          </p>

          {localMessage ? (
            <div
              className="text-center py-6 px-4 rounded-lg"
              style={{
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                color: "#10B981",
                fontFamily: "Inter, sans-serif",
              }}
            >
              <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">{localMessage}</p>
              <Link to="/login" className="block mt-4 text-sm" style={{ color: "#00E5FF" }}>
                Go to Login
              </Link>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={HandleFormSubmit}>
              <div>
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="input-field"
                  required
                />
              </div>

              <div className="relative">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="input-field pr-11"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 p-0.5"
                  style={{ color: "#9CA3AF" }}
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <AiFillEyeInvisible size={18} /> : <AiFillEye size={18} />}
                </button>
              </div>

              <button type="submit" className="btn-primary w-full text-base">
                Create Account
              </button>

              {error && (
                <p className="text-sm" style={{ color: "#EF4444", fontFamily: "Inter, sans-serif" }}>
                  {error.error || "Signup failed. Please try again."}
                </p>
              )}
            </form>
          )}

          {!localMessage && (
            <>
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
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.64 12.204c0-.638-.057-1.252-.164-1.843H12v3.492h6.64c-.287 1.54-1.12 2.84-2.385 3.704v3.084h3.865c2.265-2.085 3.56-5.155 3.56-8.437z" fill="#4285F4"/>
                  <path d="M12 24c3.24 0 5.96-1.08 7.946-2.92l-3.866-3.084c-1.08.72-2.47 1.145-4.08 1.145-3.14 0-5.8-2.12-6.76-4.97H1.34v3.11C3.32 21.51 7.32 24 12 24z" fill="#34A853"/>
                  <path d="M5.24 14.01A7.34 7.34 0 0 1 4.91 12c0-.7.12-1.38.32-2.01V6.89H1.34A11.99 11.99 0 0 0 0 12c0 1.88.44 3.66 1.23 5.11l3.99-3.1z" fill="#FBBC05"/>
                  <path d="M12 4.8c1.76 0 3.34.61 4.58 1.8l3.43-3.43C17.96 1.28 15.24 0 12 0 7.32 0 3.32 2.49 1.34 6.89l3.91 3.11C6.2 7.92 8.86 4.8 12 4.8z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <p className="text-sm text-center mt-6" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium transition-colors duration-150"
                  style={{ color: "#00E5FF" }}
                  onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                  onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
