import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, backendUrl, loadUserPrifileData, token } =
    useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append(
        "dob",
        userData.dob === "Not Selected" ? "" : userData.dob,
      );

      image && formData.append("image", image);

      const { data } = await axios.put(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } },
      );

      if (data.success) {
        toast.success(data.message);

        setIsEdit(false);
        setImage(false);
        setUserData((prev) => ({
          ...prev,
          ...userData,
        }));
        await loadUserPrifileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    userData && (
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-start py-10 px-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 md:p-10">
          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center text-center">
            {isEdit ? (
              <label htmlFor="image">
                <div className="relative group cursor-pointer">
                  <img
                    className="w-32 h-32 object-cover rounded-full border-4 border-gray-200 shadow-md group-hover:opacity-70 transition"
                    src={image ? URL.createObjectURL(image) : userData.image}
                    alt=""
                  />
                  <img
                    className="w-8 absolute bottom-2 right-2 opacity-80"
                    src={image ? null : assets.upload_icon}
                    alt=""
                  />
                </div>
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  id="image"
                  hidden
                />
              </label>
            ) : (
              <img
                className="w-32 h-32 object-cover rounded-full border-4 border-gray-200 shadow-md"
                src={userData.image}
                alt=""
              />
            )}

            {/* NAME */}
            {isEdit ? (
              <input
                className="mt-4 text-2xl md:text-3xl font-semibold text-center bg-gray-100 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                type="text"
                value={userData.name}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            ) : (
              <p className="mt-4 text-2xl md:text-3xl font-semibold text-gray-800">
                {userData.name}
              </p>
            )}
          </div>

          <hr className="my-6 border-gray-200" />

          {/* CONTACT INFO */}
          <div>
            <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase">
              Contact Information
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <p className="font-medium text-gray-600">Email</p>
                <p className="text-blue-500 break-words">{userData.email}</p>
              </div>

              <div>
                <p className="font-medium text-gray-600">Phone</p>
                {isEdit ? (
                  <input
                    className="w-full mt-1 bg-gray-100 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                    type="text"
                    value={userData.phone}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <p className="text-blue-500">{userData.phone}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <p className="font-medium text-gray-600">Address</p>
                {isEdit ? (
                  <div className="space-y-2 mt-1">
                    <input
                      className="w-full bg-gray-100 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            line1: e.target.value,
                          },
                        }))
                      }
                      value={userData?.address?.line1 || ""}
                      type="text"
                    />
                    <input
                      className="w-full bg-gray-100 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            line2: e.target.value,
                          },
                        }))
                      }
                      value={userData?.address?.line2 || ""}
                      type="text"
                    />
                  </div>
                ) : (
                  <p className="text-gray-500">
                    {userData?.address?.line1 || ""} <br />
                    {userData?.address?.line2 || ""}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* BASIC INFO */}
          <div className="mt-8">
            <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase">
              Basic Information
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <p className="font-medium text-gray-600">Gender</p>
                {isEdit ? (
                  <select
                    className="w-full mt-1 bg-gray-100 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    value={
                      userData.gender === "Not Selected" ? "" : userData.gender
                    }
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                ) : (
                  <p className="text-gray-500">{userData.gender}</p>
                )}
              </div>

              <div>
                <p className="font-medium text-gray-600">Birthday</p>
                {isEdit ? (
                  <input
                    className="w-full mt-1 bg-gray-100 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                    type="date"
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        dob: e.target.value,
                      }))
                    }
                    value={
                      userData.dob === "Not Selected" || !userData.dob
                        ? ""
                        : userData.dob
                    }
                  />
                ) : (
                  <p className="text-gray-500">
                    {userData.dob && userData.dob !== "Not Selected"
                      ? userData.dob
                      : "Not Selected"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* BUTTON */}
          <div className="mt-10 flex justify-center">
            {isEdit ? (
              <button
                className="px-8 py-2 rounded-full bg-primary text-white shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
                onClick={updateUserProfileData}
              >
                Save Information
              </button>
            ) : (
              <button
                className="px-8 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white shadow-sm hover:shadow-md transition-all duration-300"
                onClick={() => setIsEdit(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default MyProfile;
