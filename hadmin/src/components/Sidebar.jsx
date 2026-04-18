import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assests/assets";
import { DoctorContext } from "../context/DoctorContext";

function Sidebar() {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  const baseClass =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer group";

  const activeClass =
    "bg-gradient-to-r from-primary to-indigo-500 text-white shadow-lg";

  const inactiveClass =
    "text-gray-600 hover:bg-white/60 hover:shadow-md hover:scale-[1.02]";

  return (
    <div className="min-h-screen w-20 md:w-72 bg-gradient-to-b from-white via-indigo-50 to-purple-50 border-r border-white/40 backdrop-blur-xl shadow-xl p-3">
      {/* LOGO / TOP */}
      <div className="flex items-center justify-center md:justify-start gap-2 px-2 py-4">
        <div
          className="w-28 h-10 rounded-xl 
  bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 
  bg-[length:200%_200%] animate-gradient 
  flex items-center justify-center text-white font-bold shadow-lg 
  hover:scale-105 hover:shadow-2xl transition-all duration-300 
  cursor-pointer relative overflow-hidden"
        >
          {/* SHINE EFFECT */}
          <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition duration-500"></span>

          {/* TEXT */}
          <span className="relative z-10 tracking-wide">Kishore</span>
        </div>
        <p className="hidden md:block font-semibold text-gray-700">Hospitals</p>
      </div>

      {/* ADMIN MENU */}
      {aToken && (
        <ul className="mt-6 space-y-2">
          <NavLink
            to={"/admin-dashboard"}
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <img
              className="w-5 group-hover:scale-110 transition"
              src={assets.home_icon}
            />
            <p className="hidden md:block font-medium">Dashboard</p>
          </NavLink>

          <NavLink
            to={"/all-appointments"}
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <img
              className="w-5 group-hover:scale-110 transition"
              src={assets.appointment_icon}
            />
            <p className="hidden md:block font-medium">Appointments</p>
          </NavLink>

          <NavLink
            to={"/add-doctor"}
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <img
              className="w-5 group-hover:scale-110 transition"
              src={assets.add_icon}
            />
            <p className="hidden md:block font-medium">Add Doctor</p>
          </NavLink>

          <NavLink
            to={"/all-doctors"}
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <img
              className="w-5 group-hover:scale-110 transition"
              src={assets.people_icon}
            />
            <p className="hidden md:block font-medium">Doctors List</p>
          </NavLink>
        </ul>
      )}

      {/* DOCTOR MENU */}
      {dToken && (
        <ul className="mt-6 space-y-2">
          <NavLink
            to={"/doctor-dashboard"}
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <img
              className="w-5 group-hover:scale-110 transition"
              src={assets.home_icon}
            />
            <p className="hidden md:block font-medium">Dashboard</p>
          </NavLink>

          <NavLink
            to={"/doctor-appointments"}
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <img
              className="w-5 group-hover:scale-110 transition"
              src={assets.appointment_icon}
            />
            <p className="hidden md:block font-medium">Appointments</p>
          </NavLink>

          <NavLink
            to={"/doctor-profile"}
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <img
              className="w-5 group-hover:scale-110 transition"
              src={assets.people_icon}
            />
            <p className="hidden md:block font-medium">Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
}

export default Sidebar;
