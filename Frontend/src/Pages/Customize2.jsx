import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { userDataContext } from '../context/UserContext';
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

// ✅ Particles imports
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";

function Customize2() {
    const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(userDataContext);
    const [assistantName, setAssistantName] = useState(userData?.assistantName || "");
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    // ✅ Particle Engine Setup
    const [init, setInit] = useState(false);
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadFull(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const handleupdateAssistant = async () => {
        try {
            setLoading(true); // Start loading
            let formData = new FormData();
            formData.append("assistantName", assistantName);

            if (backendImage) {
                formData.append("assistantImage", backendImage);
            } else {
                formData.append("imageUrl", selectedImage);
            }

            const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true });
            console.log(result.data);
            setUserData(result.data);
        } catch (error) {
            console.error("Error updating assistant:", error);
        } finally {
            setLoading(false); // Stop loading
            navigate("/")
        }
    };

    return (
        <div className="relative w-full min-h-screen bg-gradient-to-t from-black to-[#010178] flex flex-col items-center py-12 px-4 overflow-hidden">
            
            {/* ✅ Particles Background */}
            {init && (
                <Particles
                    id="tsparticles"
                    className="absolute top-0 left-0 w-full h-full z-0"
                    options={{
                        background: { color: { value: "#00000000" } },
                        fpsLimit: 60,
                        interactivity: {
                            events: { onHover: { enable: true, mode: "repulse" }, resize: true },
                            modes: { repulse: { distance: 100, duration: 0.4 } },
                        },
                        particles: {
                            color: { value: "#ffffff" },
                            links: { color: "#00bfff", distance: 120, enable: true, opacity: 0.3, width: 1 },
                            move: { enable: true, speed: 2 },
                            number: { value: 60, density: { enable: true, area: 800 } },
                            opacity: { value: 0.6 },
                            shape: { type: "circle" },
                            size: { value: { min: 1, max: 3 } },
                        },
                        detectRetina: true,
                    }}
                />
            )}

            <IoArrowBackCircleSharp className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer z-10' onClick={() => navigate("/customize")} />
            
            <h1 className="text-white text-3xl md:text-4xl font-bold text-center mb-4 z-10">
                Customize Your <span className="text-blue-500">Assistant Name</span>
            </h1>

            <p className="text-gray-300 text-center max-w-[600px] mb-12 z-10">
                Enter or personalize your assistant name according to your comfort.
            </p>

            {/* Input for Assistant Name */}
            <div className="w-full max-w-[400px] flex flex-col items-center z-10">
                <label className="text-white text-lg mb-2" htmlFor="assistantName">
                    Assistant Name
                </label>
                <input
                    id="assistantName"
                    type="text"
                    value={assistantName}
                    onChange={(e) => setAssistantName(e.target.value)}
                    placeholder="Enter assistant name"
                    className="w-full px-4 py-3 rounded-xl bg-[#12125e] border border-blue-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />

                {/* Button shows only if assistantName is entered */}
                {assistantName && (
                    <button
                        className="w-full md:w-[280px] h-14 mt-8 rounded-xl font-semibold text-lg 
                        bg-blue-500 hover:bg-white text-black hover:text-blue-600 transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center"
                        onClick={handleupdateAssistant}
                        disabled={loading} // disable while loading
                    >
                        {loading ? (
                            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
                        ) : null}
                        {loading ? "Updating..." : "Create Virtual Assistant"}
                    </button>
                )}
            </div>
        </div>
    );
}

export default Customize2;
