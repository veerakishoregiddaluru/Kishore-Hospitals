import React from "react";
import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useEffect } from "react";
import { assets } from "../../assests/assets";

const DoctorDashboard = () => {
  const {
    getDashData,
    dToken,
    dashData,
    setDashData,
    cancelAppointment,
    getAppointments,
    completeAppointment,
  } = useContext(DoctorContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
      getAppointments();
    }
  }, [dToken]);

  return (
    dashData && (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 p-4 md:p-8">
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* CARD */}
          <div className="flex items-center gap-4 p-6 rounded-2xl bg-white/70 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/40">
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 shadow-md">
              <img className="w-10" src={assets.earning_icon} alt="" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {dashData.earnings}
              </p>
              <p className="text-gray-500 text-sm">Earnings</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 rounded-2xl bg-white/70 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/40">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-500 shadow-md">
              <img className="w-10" src={assets.appointments_icon} alt="" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {dashData.appointments}
              </p>
              <p className="text-gray-500 text-sm">Appointments</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 rounded-2xl bg-white/70 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/40">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 shadow-md">
              <img className="w-10" src={assets.patients_icon} alt="" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {dashData.patients}
              </p>
              <p className="text-gray-500 text-sm">Patients</p>
            </div>
          </div>
        </div>

        {/* BOOKINGS SECTION */}
        <div className="mt-10 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 overflow-hidden">
          {/* HEADER */}
          <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-primary to-indigo-500 text-white">
            <img className="w-6" src={assets.list_icon} alt="" />
            <p className="font-semibold text-lg">Latest Bookings</p>
          </div>

          {/* LIST */}
          <div className="divide-y">
            {dashData.latestAppointments?.map((item, index) => (
              <div
                key={index}
                className="flex items-center px-6 py-4 gap-4 hover:bg-gray-50 transition-all duration-300"
              >
                {/* USER IMAGE */}
                <img
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  src={item.userData.image}
                  alt=""
                />

                {/* INFO */}
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {item.userData.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(item.slotDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* STATUS */}
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
    )
  );
};

export default DoctorDashboard;
