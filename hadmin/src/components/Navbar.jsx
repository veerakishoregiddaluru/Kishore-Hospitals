import React, { useContext } from "react";
import { assets } from "../assests/assets";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    // Admin logout
    if (aToken) {
      setAToken("");
      localStorage.removeItem("aToken");
    }

    // Doctor logout
    if (dToken) {
      setDToken("");
      localStorage.removeItem("dToken");
    }

    navigate("/");
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      {/* Left Section */}
      <div className="flex items-center gap-2 text-xs">
        <img className="w-20 sm:w-20 cursor-pointer" src={assets.kh1} alt="" />

        <p
          className="relative px-3 py-1 rounded-full text-sm font-medium 
bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
text-white shadow-md overflow-hidden"
        >
          <span className="relative z-10">
            {aToken ? "Admin" : dToken ? "Doctor" : ""}
          </span>

          <span
            className="absolute top-0 left-[-100%] w-full h-full 
  bg-white/30 skew-x-12 animate-shine"
          ></span>
        </p>
      </div>

      {/* Logout Button */}
      {(aToken || dToken) && (
        <button
          onClick={handleLogout}
          className="bg-primary text-white text-sm px-10 py-2 rounded-full"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Navbar;
