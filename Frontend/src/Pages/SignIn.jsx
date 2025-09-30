import bg from "../assets/authBg.png";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext.jsx";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { serverUrl, userData, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
     setUserData(result.data)
     setLoading(false)
      navigate("/");
    } catch (error) {
      console.log(error);
      setUserData(null)
      setLoading(false)
      setErr(error.response?.data?.message || "Invalid email or password.");
    }
  };

  return (
    <div
      className="w-full h-screen bg-cover flex justify-center items-center px-4"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-black/60 backdrop-blur-md shadow-2xl shadow-black rounded-2xl p-8 flex flex-col gap-6"
      >
        {/* Title */}
        <h1 className="text-white text-3xl font-bold text-center">
          Welcome Back 👋
        </h1>
        <p className="text-gray-300 text-center text-sm">
          Log in to continue using <span className="text-blue-400">Virtual Assistant</span>
        </p>

        {/* Error Box */}
        {err && (
          <div className="w-full bg-red-600/20 text-red-400 border border-red-500 rounded-md px-4 py-2 text-sm text-center">
            {err}
          </div>
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email Address"
          className="w-full h-14 border border-gray-400 bg-transparent text-white placeholder-gray-400 px-4 rounded-xl focus:outline-none focus:border-blue-400 transition"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        {/* Password */}
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-14 border border-gray-400 bg-transparent text-white placeholder-gray-400 px-4 rounded-xl pr-12 focus:outline-none focus:border-blue-400 transition"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {showPassword ? (
            <IoEyeOff
              className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-300 cursor-pointer hover:text-white"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoEye
              className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-300 cursor-pointer hover:text-white"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full h-14 mt-2 rounded-xl font-semibold text-lg transition 
            ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        {/* Bottom Link */}
        <p className="text-gray-300 text-center text-sm">
          Don’t have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
