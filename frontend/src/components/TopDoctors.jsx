import React, { useContext } from "react";

import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center gap-4 my-20 px-4 md:px-10 bg-gradient-to-br from-gray-50 via-white to-gray-100 py-10 rounded-3xl">
      {/* HEADER */}
      <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 text-center">
        Top Doctors to Book
      </h1>

      <p className="sm:w-1/2 text-center text-gray-500 text-sm md:text-base">
        Simply browse through our extensive list of trusted doctors.
      </p>

      {/* GRID */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
        {doctors.slice(0, 10).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            key={index}
            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2"
          >
            {/* IMAGE WITH OVERLAY */}
            <div className="relative overflow-hidden">
              <img
                className="w-full h-48 object-cover object-top bg-gray-100 group-hover:scale-105 transition duration-500"
                src={item.image}
                alt=""
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition duration-500"></div>
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

      {/* BUTTON */}
      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="mt-8 px-8 py-2 rounded-full bg-primary text-white shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
      >
        View All Doctors
      </button>
    </div>
  );
};

export default TopDoctors;
