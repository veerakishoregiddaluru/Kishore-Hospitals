import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "./RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, dollar, backendUrl, token, getDoctorsData } =
    useContext(AppContext);

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const navigate = useNavigate();

  // ✅ Fetch doctor info
  const fetchDocInfo = () => {
    const doc = doctors.find((doc) => doc._id === docId);
    setDocInfo(doc);
  };

  // ✅ Generate slots
  const getAvailableSlots = () => {
    setDocSlots([]);

    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10,
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };
  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login first");
      return navigate("/login");
    }

    if (!slotTime) {
      toast.error("Select a time slot");
      return;
    }

    try {
      const date = docSlots[slotIndex][0].datetime;

      const slotDate = date.toISOString().split("T")[0]; // ✅ FIX

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } },
      );

      if (data.success) {
        toast.success(data.message);

        await getDoctorsData(); // ✅ refresh data

        navigate("/my-appiontments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Booking failed");
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  // ✅ Get booked slots for selected day
  const getBookedSlots = () => {
    if (!docInfo || !docSlots[slotIndex]?.length) return [];

    const date = docSlots[slotIndex][0].datetime;
    const formattedDate = date.toISOString().split("T")[0];

    return docInfo?.slotsBooked?.[formattedDate] || [];
  };

  const bookedSlots = getBookedSlots();

  return (
    docInfo && (
      <div>
        {/* Doctor Info */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 bg-white">
            <p className="flex items-center gap-2 text-2xl font-medium">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} />
            </p>

            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree}-{docInfo.speciality}
              </p>
              <span className="px-2 border text-xs rounded-full">
                {docInfo.experience}
              </span>
            </div>

            <p className="mt-3 text-sm text-gray-500">{docInfo.about}</p>

            <p className="mt-4 font-medium">
              Fee: {dollar}
              {docInfo.fees}
            </p>
          </div>
        </div>

        {/* Slots */}
        <p className="mt-6 font-medium">Booking Slots</p>

        {/* Dates */}
        <div className="flex gap-3 overflow-x-scroll mt-4">
          {docSlots.map((item, index) => (
            <div
              key={index}
              onClick={() => setSlotIndex(index)}
              className={`text-center py-4 px-3 min-w-16 rounded-full cursor-pointer ${
                slotIndex === index
                  ? "bg-primary text-white"
                  : "border border-gray-300"
              }`}
            >
              <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        {/* Times */}
        <div className="flex gap-3 overflow-x-scroll mt-4">
          {docSlots[slotIndex]?.map((item, index) => {
            const isBooked = bookedSlots.includes(item.time);

            return (
              <p
                key={index}
                onClick={() => !isBooked && setSlotTime(item.time)}
                className={`px-5 py-2 rounded-full text-sm ${
                  isBooked
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : item.time === slotTime
                      ? "bg-primary text-white"
                      : "bg-gray-300 cursor-pointer"
                }`}
              >
                {item.time.toLowerCase()}
              </p>
            );
          })}
        </div>

        {/* Button */}
        <button
          onClick={bookAppointment}
          className="bg-primary text-white px-10 py-3 rounded-full mt-6"
        >
          Book Appointment
        </button>

        {/* Related Doctors */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
