import React, { useContext } from "react";
import { userDataContext } from "../context/UserContext";

function Card({ image }) {
  const { serverUrl, userData, setUserData, backendImage, setBackendImage,
    frontendImage, setFrontendImage, selectedImage, setSelectedImage } = useContext(userDataContext)


  return (
    <div className={`w-full aspect-[2/3] max-w-[280px] bg-[#12125e] border-2 border-blue-500 rounded-2xl overflow-hidden cursor-pointer 
      hover:shadow-2xl hover:shadow-blue-950 hover:border-white hover:scale-105 transition-all duration-300
       ${selectedImage == image ? "border-4 border-white shadow-2xl shadow-blue-950" : null}`}
      onClick={() => {
        setSelectedImage(image)
        setBackendImage(null)
        setFrontendImage(null)
        
        }}>
      <img
        src={image}
        alt="Card"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export default Card;
