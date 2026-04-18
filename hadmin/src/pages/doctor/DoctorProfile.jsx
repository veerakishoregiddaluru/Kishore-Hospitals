import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const DoctorProfile = () => {
  const { setProfileData, profileData, getProfileData, dToken, backendUrl } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: Number(profileData.fees),
        available: profileData.available,
      };

      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        updateData,
        { headers: { dToken } },
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        await getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    profileData && (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[300px_1fr] gap-8">
          {/* LEFT PROFILE CARD */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-6 flex flex-col items-center text-center border border-white/40 hover:shadow-3xl transition-all duration-500">
            <div className="relative group">
              <img
                className="w-48 h-48 object-cover rounded-2xl border-4 border-white shadow-lg group-hover:scale-105 transition duration-500"
                src={profileData.image}
                alt=""
              />
              <div className="absolute inset-0 rounded-2xl bg-primary/0 group-hover:bg-primary/20 transition duration-500"></div>
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-800">
              {profileData.name}
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              {profileData.degree} • {profileData.speciality}
            </p>

            <span className="mt-3 px-4 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 text-white shadow-md">
              {profileData.experience}
            </span>
          </div>

          {/* RIGHT DETAILS */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/40 transition-all duration-500">
            {/* ABOUT */}
            <div>
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                About
              </p>
              <p className="mt-2 text-gray-600 leading-relaxed">
                {profileData.about}
              </p>
            </div>

            {/* FEES */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Appointment Fee
              </p>
              <div className="mt-2 text-lg font-bold text-gray-800">
                {currency}
                {isEdit ? (
                  <input
                    className="ml-2 px-3 py-1 rounded-lg border bg-gray-100 focus:ring-2 focus:ring-primary outline-none"
                    value={profileData.fees}
                    type="number"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fees: Number(e.target.value),
                      }))
                    }
                  />
                ) : (
                  profileData.fees
                )}
              </div>
            </div>

            {/* ADDRESS */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Address
              </p>

              <div className="mt-2 space-y-2">
                {isEdit ? (
                  <>
                    <input
                      className="w-full px-3 py-2 rounded-lg bg-gray-100 border focus:ring-2 focus:ring-primary outline-none"
                      type="text"
                      value={profileData.address.line1}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            line1: e.target.value,
                          },
                        }))
                      }
                    />
                    <input
                      className="w-full px-3 py-2 rounded-lg bg-gray-100 border focus:ring-2 focus:ring-primary outline-none"
                      type="text"
                      value={profileData.address.line2}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            line2: e.target.value,
                          },
                        }))
                      }
                    />
                  </>
                ) : (
                  <p className="text-gray-600">
                    {profileData.address.line1} <br />
                    {profileData.address.line2}
                  </p>
                )}
              </div>
            </div>

            {/* AVAILABILITY TOGGLE */}
            <div className="mt-6 flex items-center gap-3">
              <input
                type="checkbox"
                checked={profileData.available}
                onChange={() =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
                className="w-5 h-5 accent-primary cursor-pointer"
              />
              <label className="text-gray-700 font-medium">
                Available for Appointments
              </label>
            </div>

            {/* BUTTON */}
            <div className="mt-8">
              {isEdit ? (
                <button
                  onClick={updateProfile}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-primary to-indigo-500 text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
                >
                  Save Information
                </button>
              ) : (
                <button
                  onClick={() => setIsEdit(true)}
                  className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white shadow-sm hover:shadow-md transition-all duration-300"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
