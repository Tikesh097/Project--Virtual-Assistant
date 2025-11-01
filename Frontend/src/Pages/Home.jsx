import { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiImg from "../assets/ai.gif";
import { CgMenuRight } from "react-icons/cg";
import userImg from "../assets/user.gif";
import { FaHistory } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; // lightweight bundle

function Home() {
  const { userData, setUserData, getGeminiResponse } = useContext(userDataContext);
  const navigate = useNavigate();

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [init, setInit] = useState(false);

  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const voicesRef = useRef(null);

  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.error(error);
    }
  };

  const startListeningWithDelay = () => {
    setTimeout(() => {
      try {
        if (recognitionRef.current && !isRecognizingRef.current && !isSpeakingRef.current) {
          recognitionRef.current.start();
          setListening(true);
          setUserText("Listening...");
          setAiText("");
        }
      } catch (err) {
        if (err.name !== "InvalidStateError") console.error("Recognition start error:", err);
      }
    }, 300);
  };

  const startRecognition = () => {
    try {
      recognitionRef.current?.start();
      setListening(true);
      setUserText("Listening...");
      setAiText("");
    } catch (error) {
      if (!error.message.includes("start")) console.error("Recognition error:", error);
    }
  };

  const speak = (text) => {
    setAiText(text);
    setUserText("");
    isSpeakingRef.current = true;

    if (!synth) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";

    const voices = voicesRef.current || synth.getVoices();
    if (!voicesRef.current) voicesRef.current = voices;

    const hindiVoice = voices.find((v) => v.lang === "hi-IN");
    if (hindiVoice) utterance.voice = hindiVoice;

    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      startListeningWithDelay();
    };

    synth.cancel();
    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === "google-search")
      window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, "_blank");
    if (type === "youtube-search" || type === "youtube-play")
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`, "_blank");
    if (type === "calculator-open") window.open(`https://www.google.com/search?q=calculator`, "_blank");
    if (type === "instagram-open") window.open(`https://www.instagram.com/`, "_blank");
    if (type === "facebook-open") window.open(`https://www.facebook.com/`, "_blank");
    if (type === "weather-show") window.open(`https://www.google.com/search?q=weather`, "_blank");
  };

  const handleCustomize = () => {
    navigate("/customize");
    setMenuOpen(false);
    setHistoryOpen(false);
  };

  const openHistory = () => {
    setHistoryOpen(true);
    setMenuOpen(false);
  };

  const openMenu = () => {
    setMenuOpen(true);
    setHistoryOpen(false);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return console.error("SpeechRecognition not supported");

    if (synth?.getVoices().length > 0) {
      voicesRef.current = synth.getVoices();
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
      setUserText("Listening...");
      setAiText("");
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      setUserText("");
      if (!isSpeakingRef.current) startListeningWithDelay();
    };

    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      setUserText("");
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();

      if (userData?.assistantName && transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setUserText(transcript);
        setAiText("");
        setLoading(true);

        try {
          const data = await getGeminiResponse(transcript);
          setLoading(false);
          handleCommand(data);
        } catch (error) {
          console.error("Error getting Gemini response:", error);
          setLoading(false);
        }

        setUserText("");
      }
    };

    startRecognition();

    const handleVoicesChanged = () => {
      voicesRef.current = synth.getVoices();

      if (userData?.name) {
        const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, how can I help you?`);
        greeting.lang = "hi-IN";

        const hindiVoice = voicesRef.current?.find((v) => v.lang === "hi-IN");
        if (hindiVoice) greeting.voice = hindiVoice;

        greeting.onend = () => startListeningWithDelay();
        synth.speak(greeting);
      }
    };

    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;

    return () => {
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [getGeminiResponse, userData?.assistantName, userData?.name, synth]);

  return (
    
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col gap-6 relative overflow-hidden">
    
     {/* Background Particles */}
      {init && (
        <Particles
          id="tsparticles"
          className="absolute inset-0 z-0"
          options={{
            background: { color: { value: "#000000" } },
            fpsLimit: 120,
            interactivity: {
              events: {
                onHover: { enable: true, mode: "repulse" },
                resize: true,
              },
              modes: { repulse: { distance: 100, duration: 0.4 } },
            },
            particles: {
              color: { value: "#ffffff" },
              links: { color: "#ffffff", distance: 120, enable: true, opacity: 0.3, width: 1 },
              move: { enable: true, speed: 1, outModes: { default: "bounce" } },
              number: { density: { enable: true, area: 800 }, value: 70 },
              opacity: { value: 0.3 },
              shape: { type: "circle" },
              size: { value: { min: 1, max: 4 } },
            },
            detectRetina: true,
          }}
        />
      )}

    


      {/* Hamburger Menu Toggle (Mobile/Tablet) */}
      <button
        aria-label="Open Menu"
        onClick={openMenu}
        className="lg:hidden text-white absolute top-6 right-6 w-8 h-8 z-50 flex items-center justify-center hover:scale-110 transition-transform"
      >
        <CgMenuRight className="w-full h-full" />
      </button>

      {/* Mobile Menu (Sidebar/Modal) */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 lg:hidden" onClick={() => setMenuOpen(false)}>
          <div className="flex justify-start p-4 sm:p-6 h-full" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-2xl shadow-2xl flex flex-col w-full sm:w-80 h-full max-h-[90vh] overflow-hidden">
              <div className="p-5 sm:p-7 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Menu</h2>
                <button
                  aria-label="Close Menu"
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-600 hover:text-gray-900 text-2xl font-semibold"
                >
                  <AiOutlineClose className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto">
                <div className="space-y-3">
                  <button
                    onClick={handleLogout}
                    className="w-full h-12 sm:h-14 text-gray-800 font-semibold bg-gray-50 border hover:bg-red-500 hover:text-black rounded-full transition-all duration-200 flex items-center justify-center"
                  >
                    Logout
                  </button>
                  <button
                    onClick={handleCustomize}
                    className="w-full h-12 sm:h-14 text-gray-800 font-semibold bg-gray-50 border hover:bg-blue-500 hover:text-black rounded-full transition-all duration-200 flex items-center justify-center"
                  >
                    ✨ Customize Your Assistant
                  </button>
                  <button
                    onClick={openHistory}
                    className="w-full h-12 sm:h-14 text-gray-800 font-semibold bg-gray-50 border hover:bg-green-500 hover:text-black rounded-full transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <FaHistory aria-hidden="true" /> Recent History
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Buttons */}
      <div className="hidden lg:flex absolute top-6 right-4 gap-3 z-10">
        <button
          onClick={openHistory}
          className="px-4 py-2 lg:px-3 lg:py-3 text-gray-800 font-semibold bg-white/95 backdrop-blur-sm hover:bg-gray-400 hover:text-black rounded-full transition-all duration-200 shadow-lg hover:shadow-xl border flex items-center gap-2"
          aria-label="Open Recent History"
        >
          <FaHistory className="text-blue-600" aria-hidden="true" /> Recent History
        </button>
        <button
          onClick={handleCustomize}
          className="px-4 py-2 lg:px-3 lg:py-3 text-gray-800 font-semibold bg-white/95 backdrop-blur-sm hover:bg-blue-500 hover:text-black rounded-full transition-all duration-200 shadow-lg hover:shadow-xl border"
          aria-label="Customize Your Assistant"
        >
          ✨ Customize Your Assistant
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 lg:px-3 lg:py-3 text-gray-800 font-semibold bg-white/95 backdrop-blur-sm hover:bg-red-500 hover:text-black rounded-full transition-all duration-200 shadow-lg hover:shadow-xl border"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>

      {/* History Modal (For All Screens) */}
      {historyOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setHistoryOpen(false)}>
          <div
            className="bg-white rounded-3xl shadow-2xl flex flex-col w-full max-w-lg h-3/4 max-h-[80vh] overflow-hidden transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaHistory className="text-blue-600" aria-hidden="true" /> Recent History
              </h2>
              <button
                aria-label="Close History Modal"
                onClick={() => setHistoryOpen(false)}
                className="text-gray-600 hover:text-gray-900 text-2xl font-semibold"
              >
                <AiOutlineClose className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
              <div className="space-y-3">
                {userData?.history?.length > 0 ? (
                  userData.history.slice(0).reverse().map((his, i) => (
                    <div
                      key={i}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-gray-700 text-sm leading-relaxed">{his}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <span className="text-gray-500 text-md">No history available yet. Start talking to your assistant!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col items-center gap-6 sm:gap-8 px-4 sm:px-6 md:px-8 py-6 sm:py-8 max-w-4xl mx-auto">
        <div className="relative">
          <div className="w-64 h-80 sm:w-72 sm:h-96 lg:w-96 lg:h-[28rem] flex justify-center items-center overflow-hidden rounded-3xl shadow-2xl bg-white/10 backdrop-blur-sm border">
            {userData?.assistantImage ? (
              <img
                src={userData.assistantImage}
                alt="Assistant Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400">
                No Image Available
              </div>
            )}
          </div>
          <div className="mt-4 sm:mt-6 text-center">
            <h1 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold tracking-wide">
              I'm {userData?.assistantName || "Your Assistant"}
            </h1>
          </div>
        </div>

        {/* User/AI Indicator & Chat Bubble */}
        <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-2xl">
          <div className="flex justify-center">
            {!aiText && (
              <div className="w-32 sm:w-40 lg:w-48 h-auto opacity-90">
                <img src={userImg} alt="User indicator" className="w-full h-auto" />
              </div>
            )}
            {aiText && (
              <div className="w-32 sm:w-40 lg:w-48 h-auto opacity-90">
                <img src={aiImg} alt="AI indicator" className="w-full h-auto" />
              </div>
            )}
          </div>

          {(userText || aiText || loading) && (
            <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
              <div className="bg-white/10 backdrop-blur-md border rounded-2xl p-4 sm:p-6 shadow-lg flex justify-center items-center">
                {loading ? (
                  <div className="text-white font-semibold text-lg">Loading...</div>
                ) : (
                  <p className="text-white text-base sm:text-lg md:text-xl font-medium text-center leading-relaxed">
                    {userText || aiText}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
