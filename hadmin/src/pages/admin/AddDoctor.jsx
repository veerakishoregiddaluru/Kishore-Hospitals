import React, { useContext, useState } from "react";
import { assets } from "../../assests/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");

  const [speciality, setSpeciality] = useState("General Physician");
  const [degree, setDegree] = useState("MBBS");
  const [addres1, setAddress1] = useState("");
  const [addres2, setAddress2] = useState("");
  const [available, setAvailable] = useState(true);

  const { backendUrl, aToken } = useContext(AdminContext);

  const onsubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (!docImg) {
        return toast.error("Image Not Selected!");
      }

      const formData = new FormData();

      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({ line1: addres1, line2: addres2 }),
      );
      formData.append("available", available);
      formData.append("about", about);

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        {
          headers: { atoken: aToken },
        },
      );

      if (data.success) {
        toast.success(data.message);
        setDocImg(false);
        setName("");
        setPassword("");
        setEmail("");
        setFees("");
        setAddress1("");
        setAddress2("");
        setAbout("");
        setAvailable(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={onsubmitHandler}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-10"
    >
      <div className="max-w-5xl mx-auto">
        {/* TITLE */}
        <p className="mb-6 text-2xl font-semibold text-gray-800">Add Doctor</p>

        {/* CARD */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-6 md:p-10 max-h-[85vh] overflow-y-auto">
          {/* IMAGE */}
          <div className="flex items-center gap-4 mb-10">
            <label
              htmlFor="doc-image"
              className="relative group cursor-pointer"
            >
              <img
                className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-md group-hover:scale-105 transition"
                src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                alt=""
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 rounded-full transition"></div>
            </label>

            <input
              onChange={(e) => setDocImg(e.target.files[0])}
              type="file"
              id="doc-image"
              hidden
            />

            <p className="text-gray-500 font-medium">Upload Doctor Picture</p>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600">
            {/* LEFT */}
            <div className="space-y-5">
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="input-premium"
                placeholder="Doctor Name"
                required
              />

              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="input-premium"
                type="email"
                placeholder="Doctor Email"
                required
              />

              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="input-premium"
                type="password"
                placeholder="Password"
                required
              />

              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="input-premium"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i}>{i + 1} Year</option>
                ))}
              </select>

              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className="input-premium"
                type="number"
                placeholder="Fees"
                required
              />
            </div>

            {/* RIGHT */}
            <div className="space-y-5">
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className="input-premium"
              >
                <option>General Physician</option>
                <option>Gynecologist</option>
                <option>Dermatologist</option>
                <option>Pediatricians</option>
                <option>Neurologist</option>
                <option>Gastroenterologist</option>
              </select>

              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className="input-premium"
                placeholder="Education"
                required
              />

              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={addres1}
                className="input-premium"
                placeholder="Address Line 1"
                required
              />

              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={addres2}
                className="input-premium"
                placeholder="Address Line 2"
                required
              />

              {/* TOGGLE */}
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="checkbox"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                  className="w-5 h-5 accent-primary cursor-pointer"
                />
                <label className="font-medium text-gray-700">Available</label>
              </div>
            </div>
          </div>

          {/* ABOUT */}
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="input-premium mt-6"
            rows={5}
            placeholder="About Doctor"
            required
          />

          {/* BUTTON */}
          <button className="mt-8 px-10 py-3 rounded-full bg-indigo-300 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 hover:bg-indigo-700">
            Add Doctor
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddDoctor;
