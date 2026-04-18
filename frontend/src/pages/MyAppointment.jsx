import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const MyAppointment = () => {
  const { doctors, token, backendUrl, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);

  const navigate = useNavigate();

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    if (!slotDate) return "No Date"; // ✅ prevent crash

    const dateArray = slotDate.split("_");

    return (
      dateArray[0] +
      " " +
      months[Number(dateArray[1]) - 1] + // ✅ FIX month index
      " " +
      dateArray[2]
    );
  };
  const getUsersAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/user/list-appointments",
        { headers: { token } },
      );
      if (data.success) {
        toast.success(data.message);
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.message);
    }
  };
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId }, // no need userId
        { headers: { token } }, // ✅ VERY IMPORTANT
      );

      if (data.success) {
        toast.success(data.message);

        getUsersAppointments();
        getDoctorsData;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/verify-razorpay",
            { razorpay_order_id: response.razorpay_order_id },
            { headers: { token } },
          );
          if (data.success) {
            getUsersAppointments();
            navigate("/my-appiontments");
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          console.log(error);

          toast.error(error.message);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/payment-razorpay",
        { appointmentId },
        { headers: { token } },
      );
      if (data.success) {
        initPay(data.order);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUsersAppointments();
    }
  }, [token]);

  return (
    <div>
      <div>
        <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
          My Appointments
        </p>
        <div>
          {appointments.slice(0, 4).map((item, index) => (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
              key={index}
            >
              <div>
                <img
                  className="w-32 bg-indigo-50"
                  src={item.docData.image}
                  alt=""
                />{" "}
              </div>
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold ">
                  {item.docData.name}
                </p>
                <p>{item.docData.speciality}</p>
                <p className="text-zinc-700 font-medium mt-1">Address</p>
                <p className="text-sm">{item.docData.address.line1}</p>
                <p className="text-sm">{item.docData.address.line1}</p>
                <p>
                  Date & Time:{" "}
                  {new Date(item.slotDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  | {item.slotTime}
                </p>
              </div>
              <div></div>
              <div className="flex flex-col gap-2 justify-end">
                {!item.cancelled && item.payment && !item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border rounded text-st bg-indigo-50">
                    Paid
                  </button>
                )}
                {!item.cancelled && !item.payment && !item.isCompleted && (
                  <button
                    onClick={() => appointmentRazorpay(item._id)}
                    className="text-sm text-stone-500 sm:min text-stone-500 sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    Pay Online
                  </button>
                )}

                {!item.cancelled && !item.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="text-sm text-stone-500 sm:min-w-48 py-2 border rounded hover:bg-red-500 hover:text-white transition-all duration-300"
                  >
                    Cancel Appointment
                  </button>
                )}
                {item.cancelled && !item.isCompleted && (
                  <button className="border border-red-600 text-sm  sm:min text-white sm:min-w-48 py-2  rounded bg-red-600">
                    Cancelled Appointment{" "}
                  </button>
                )}
                {item.isCompleted && (
                  <button
                    className="sm:min-w-48 py-2 border rounded bg-green-500 text-white text-sm"
                    m
                  >
                    Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyAppointment;
