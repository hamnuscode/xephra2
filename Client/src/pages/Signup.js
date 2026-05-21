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
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
