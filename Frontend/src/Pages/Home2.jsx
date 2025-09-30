
function Home2(){
    return(

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#010178] flex flex-col items-center py-12 px-4 relative">
      
     
      {/* Hamburger for small screens */}
<div className="absolute top-4 left-4 sm:hidden z-50">
  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="text-white text-2xl focus:outline-none relative z-50"
  ><CgMenuRight />
  </button>

  {menuOpen && (
    <>
      {/* Blur background */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => setMenuOpen(false)}
      ></div>

      {/* Hamburger menu */}
      <div className="absolute top-12 left-0 bg-white rounded-lg shadow-lg flex flex-col min-w-[280px] z-50">
        <button
          onClick={handleCustomize}
          className="px-4 py-3 hover:bg-blue-500 text-black font-semibold rounded-t-lg transition"
        >
          Customize Your Assistant
        </button>
        <button
          onClick={handleLogout}
          disabled={loading}
          className={`px-4 py-3 hover:bg-gray-200 font-semibold rounded-b-lg transition ${
            loading ? "text-blue-500 cursor-not-allowed" : "text-red-800"
          }`}
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </>
  )}
</div>


      {/* Assistant Image */}
      <div className="w-64 sm:w-72 md:w-80 lg:w-96 h-80 sm:h-96 md:h-[420px] lg:h-[480px] flex justify-center items-center overflow-hidden rounded-3xl shadow-lg shadow-blue-900/50 mt-20 sm:mt-24 md:mt-28">
        <img
          src={userData?.assistantImage || "/default-avatar.png"}
          alt="Assistant"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Assistant Name */}
      {userData?.assistantName && (
        <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mt-6 text-center px-4">
          {userData?.assistantName}
        </h1>
      )}
      {!aiText && <img src={userImg} alt="" className="w-[300px]" /> }
      {aiText && <img src={aiImg} alt="" className="w-[300px]" /> }

      <h1 className="text-white tex-[18px] font-semibold text-wrap">{userText?userText:aiText?aiText:null}</h1>
    
    </div>
  );
}

export default Home2;
