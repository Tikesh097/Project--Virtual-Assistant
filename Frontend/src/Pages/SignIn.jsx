import bg from "../assets/authBg.png";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useState, useContext, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext.jsx";
import axios from "axios";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [init, setInit] = useState(false);

  const { serverUrl, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(
    () => ({
      background: {
        color: { value: "transparent" },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onHover: { enable: true, mode: "repulse" },
          resize: true,
        },
        modes: {
          repulse: { distance: 100, duration: 0.4 },
        },
      },
      particles: {
        color: { value: "#00bfff" },
        links: {
          color: "#00bfff",
          distance: 150,
          enable: true,
          opacity: 0.3,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
          outModes: { default: "bounce" },
        },
        number: { value: 70, density: { enable: true, area: 800 } },
        opacity: { value: 0.5 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 3 } },
      },
      detectRetina: true,
    }),
    []
  );

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
      setUserData(result.data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setUserData(null);
      setLoading(false);
      setErr(error.response?.data?.message || "Invalid email or password.");
    }
  };

  return (
    <div
      className="relative w-full h-screen flex justify-center items-center px-4 overflow-hidden"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}
    >
      {/* Particles Background */}
      {init && (
        <Particles
          id="tsparticles"
          options={options}
          className="absolute inset-0 z-0"
        />
      )}

      {/* Login Form */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md bg-black/60 backdrop-blur-md shadow-2xl shadow-black rounded-2xl p-8 flex flex-col gap-6"
      >
        <h1 className="text-white text-3xl font-bold text-center">
          Welcome Back 👋
        </h1>
        <p className="text-gray-300 text-center text-sm">
          Log in to continue using{" "}
          <span className="text-blue-400">Virtual Assistant</span>
        </p>

        {err && (
          <div className="w-full bg-red-600/20 text-red-400 border border-red-500 rounded-md px-4 py-2 text-sm text-center">
            {err}
          </div>
        )}

        <input
          type="email"
          placeholder="Email Address"
          className="w-full h-14 border border-gray-400 bg-transparent text-white placeholder-gray-400 px-4 rounded-xl focus:outline-none focus:border-blue-400 transition"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

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

        <button
          type="submit"
          disabled={loading}
          className={`w-full h-14 mt-2 rounded-xl font-semibold text-lg transition 
            ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

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
