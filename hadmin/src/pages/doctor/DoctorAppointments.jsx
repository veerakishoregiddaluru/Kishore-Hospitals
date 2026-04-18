import React from "react";
import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assests/assets";

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);

  const { calculateAge, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 p-4 md:p-8">
      {/* CONTAINER */}
      <div className="w-full max-w-7xl mx-auto">
        {/* HEADER */}
        <p className="mb-6 text-2xl font-semibold text-gray-800">
          All Appointments
        </p>

        {/* TABLE BOX */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 overflow-hidden">
          {/* TABLE HEADER */}
          <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-2 px-6 py-4 bg-gradient-to-r from-primary to-indigo-500 text-white text-sm font-semibold">
            <p>#</p>
            <p>Patient</p>
            <p>Payment</p>
            <p>Age</p>
            <p>Date & Time</p>
            <p>Fees</p>
            <p>Action</p>
          </div>

          {/* LIST */}
          <div className="max-h-[75vh] overflow-y-auto divide-y">
            {appointments.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-3 px-6 py-4 items-center hover:bg-gray-50 transition-all duration-300"
              >
                {/* INDEX */}
                <p className="hidden sm:block text-gray-400">{index + 1}</p>

                {/* PATIENT */}
                <div className="flex items-center gap-3 w-full">
                  <img
                    className="w-10 h-10 rounded-full object-cover border"
                    src={item.userData.image}
                    alt=""
                  />
                  <p className="font-medium text-gray-800">
                    {item.userData.name}
                  </p>
                </div>

                {/* PAYMENT */}
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.payment
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {item.payment ? "Online" : "Cash"}
                  </span>
                </div>

                {/* AGE */}
                <p className="hidden sm:block text-gray-500">
                  {calculateAge(item.userData.dob) || 0}
                </p>

                {/* DATE */}
                <p className="text-gray-600 text-sm text-center sm:text-left">
                  {new Date(item.slotDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                  <br className="sm:hidden" />
                  <span className="text-gray-400"> {item.slotTime}</span>
                </p>

                {/* FEES */}
                <p className="font-semibold text-gray-700">
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
                    <button className="p-2 rounded-full bg-red-100 hover:bg-red-500 transition">
                      <img
                        onClick={() => cancelAppointment(item._id)}
                        className="w-5"
                        src={assets.cancel_icon}
                        alt=""
                      />
                    </button>

                    <button className="p-2 rounded-full bg-green-100 hover:bg-green-500 transition">
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

export default DoctorAppointments;
