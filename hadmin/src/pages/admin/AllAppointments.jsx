import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assests/assets";

const AllAppointments = () => {
  const {
    aToken,
    appointments,
    getAllAppointments,
    cancelAppointment,
    completeAppointment,
  } = useContext(AdminContext);

  const { calculateAge, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* TITLE */}
        <p className="mb-6 text-2xl font-semibold text-gray-800">
          All Appointments
        </p>

        {/* TABLE CONTAINER */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 overflow-hidden">
          {/* HEADER */}
          <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] px-6 py-4 bg-gradient-to-r from-primary to-indigo-500 text-white text-sm font-semibold sticky top-0 z-10">
            <p>#</p>
            <p>Patient</p>
            <p>Age</p>
            <p>Date & Time</p>
            <p>Doctor</p>
            <p>Fee</p>
            <p>Actions</p>
          </div>

          {/* LIST */}
          <div className="max-h-[75vh] overflow-y-auto divide-y">
            {appointments.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] gap-4 items-center px-6 py-4 hover:bg-gray-50 transition-all duration-300 group"
              >
                {/* INDEX */}
                <p className="hidden sm:block text-gray-400">{index + 1}</p>

                {/* PATIENT */}
                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full object-cover border group-hover:scale-105 transition"
                    src={item.userData.image}
                    alt=""
                  />
                  <p className="font-medium text-gray-800">
                    {item.userData.name}
                  </p>
                </div>

                {/* AGE */}
                <p className="hidden sm:block text-gray-500">
                  {calculateAge(item.userData.dob)}
                </p>

                {/* DATE */}
                <p className="text-sm text-gray-600">
                  {new Date(item.slotDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                  <span className="text-gray-400"> | {item.slotTime}</span>
                </p>

                {/* DOCTOR */}
                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full object-cover border bg-gray-100"
                    src={item.docData.image}
                    alt=""
                  />
                  <p className="text-gray-700">{item.docData.name}</p>
                </div>

                {/* FEE */}
                <p className="font-semibold text-gray-800">
                  {currency}
                  {item.amount}
                </p>

                {/* ACTION */}
                {item.cancelled ? (
                  <span className="px-4 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                    Cancelled
                  </span>
                ) : item.isCompleted ? (
                  <span className="px-4 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">
                    Completed
                  </span>
                ) : (
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full bg-red-100 hover:bg-red-500 transition hover:scale-110">
                      <img
                        onClick={() => cancelAppointment(item._id)}
                        className="w-5"
                        src={assets.cancel_icon}
                        alt=""
                      />
                    </button>

                    <button className="p-2 rounded-full bg-green-100 hover:bg-green-500 transition hover:scale-110">
                      <img
                        onClick={() => completeAppointment(item._id)}
                        className="w-5"
                        src={assets.tick_icon}
                        alt=""
                      />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllAppointments;
