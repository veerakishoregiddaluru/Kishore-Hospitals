import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const { doctors } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 md:px-10 py-8">
      {/* HEADER */}
      <p className="text-gray-600 text-lg md:text-xl font-medium">
        Browse through the doctors specialist.
      </p>

      <div className="flex flex-col lg:flex-row items-start gap-8 mt-6">
        {/* FILTER BUTTON (MOBILE) */}
        <button
          className={`py-2 px-4 rounded-full text-sm font-medium shadow-sm border transition-all md:hidden ${
            showFilter ? "bg-primary text-white" : "bg-white text-gray-700"
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>

        {/* FILTER SIDEBAR */}
        <div
          className={`${
            showFilter ? "flex" : "hidden"
          } sm:flex flex-col gap-4 text-sm w-full lg:w-64 
  bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 
  p-5 rounded-3xl shadow-xl`}
        >
          {[
            { name: "Gynecologist", color: "from-pink-500 to-rose-500" },
            { name: "General physician", color: "from-blue-500 to-cyan-500" },
            { name: "Dermatologist", color: "from-yellow-400 to-orange-500" },
            { name: "Pediatricians", color: "from-green-400 to-emerald-500" },
            { name: "Neurologist", color: "from-purple-500 to-indigo-500" },
            { name: "Gastroenterologist", color: "from-red-400 to-pink-500" },
          ].map((specObj, i) => (
            <p
              key={i}
              onClick={() =>
                speciality === specObj.name
                  ? navigate("/doctors")
                  : navigate(`/doctors/${specObj.name}`)
              }
              className={`px-5 py-3 rounded-full text-center font-semibold cursor-pointer
      transition-all duration-300 transform
      
      ${
        speciality === specObj.name
          ? `bg-gradient-to-r ${specObj.color} text-white shadow-lg scale-105`
          : `bg-white text-gray-700 hover:bg-gradient-to-r hover:${specObj.color} hover:text-white hover:shadow-md hover:scale-105`
      }`}
            >
              {specObj.name}
            </p>
          ))}
        </div>
        {/* DOCTOR GRID */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filterDoc.map((item, index) => (
            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              key={index}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2"
            >
              {/* IMAGE */}
              <div className="overflow-hidden">
                <img
                  className="w-full h-48 object-cover hover:bg-primary group-hover:scale-105 transition duration-500"
                  src={item.image}
                  alt=""
                />
              </div>

              {/* CONTENT */}
              <div className="p-4">
                {/* STATUS */}
                <div
                  className={`flex items-center gap-2 text-xs font-medium ${
                    item.available ? "text-green-600" : "text-red-500"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.available ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  {item.available ? "Available" : "Not Available"}
                </div>

                {/* NAME */}
                <p className="mt-2 text-lg font-semibold text-gray-800 group-hover:text-primary transition">
                  {item.name}
                </p>

                {/* SPECIALITY */}
                <p className="text-sm text-gray-500">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
