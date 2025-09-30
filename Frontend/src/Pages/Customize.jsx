import React, { useContext, useRef } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import authBg from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import Card from "../components/Card";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function Customize() {
  const { userData, backendImage, setBackendImage,
    frontendImage, setFrontendImage, selectedImage, setSelectedImage } = useContext(userDataContext);

  const navigate = useNavigate();
  const inputImage = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  // Back button handler
  const handleBack = () => {
    if (userData?.assistantName && userData?.assistantImage) {
      navigate("/"); // go home if assistant exists
    } else {
      navigate("/signup"); // go to signup if user not fully set up
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#010178] flex flex-col items-center py-12 px-4">
      <IoArrowBackCircleSharp className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={handleBack}
      />

      <h1 className="text-white text-3xl md:text-4xl font-bold text-center mb-4">
        Customize Your <span className="text-blue-500">Assistant Image</span>
      </h1>

      <p className="text-gray-300 text-center max-w-[600px] mb-12">
        Choose from the available options or upload your own image to personalize your assistant.
      </p>

      {/* Grid for Cards */}
      <div className="w-full max-w-[1200px] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={authBg} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />

        {/* Upload Box */}
        <div
          className={`w-full aspect-[2/3] max-w-[280px] bg-[#010178] border-2 border-blue-500 rounded-2xl overflow-hidden 
          shadow-md shadow-blue-900/40 hover:shadow-2xl hover:shadow-blue-700/70 
          cursor-pointer hover:border-white hover:scale-105 
          transition-all duration-500 ease-in-out flex items-center justify-center ${selectedImage === "input" ? "border-4 border-white shadow-2xl shadow-blue-950" : ""}`}
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input");
          }}
        >
          {!frontendImage && <FaCloudUploadAlt className="text-white w-10 h-10 md:w-12 md:h-12" />}
          {frontendImage && <img src={frontendImage} className="h-full object-cover" />}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          className="hidden"
          onChange={handleImage}
        />
      </div>

      {selectedImage && (
        <button
          className="w-[280px] h-14 rounded-xl font-semibold text-lg 
        bg-blue-500 hover:bg-blue-600 cursor-pointer text-white transition-all duration-300 shadow-md hover:shadow-xl"
          onClick={() => navigate("/customize2")}
        >
          Next
        </button>
      )}
    </div>
  );
}

export default Customize;
