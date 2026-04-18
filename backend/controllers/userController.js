import bycrpt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import validator from "validator";

import Razorpay from "razorpay";

import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Missing Details!",
      });
    }
    // Validataing Email
    if (!validator.isEmail(email)) {
      return res.status(400).send({
        success: false,
        message: "Enter Valid Email",
      });
    }
    // Validating Strong Password
    if (password.length < 8) {
      return res.status(400).send({
        success: false,
        message: "Enter Strong Minimum 8 Characters Password!",
      });
    }

    // Hashing User Password
    const salt = await bycrpt.genSalt(10);
    const hashedPassword = await bycrpt.hash(password, salt);

    const userData = { name, email, password: hashedPassword };

    const newUser = await userModel(userData);
    const user = await newUser.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(200).send({
      success: true,
      message: "User Registered Successfully!",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Dost Not Exist!",
      });
    }

    const isMatch = await bycrpt.compare(password, user.password);
    console.log(isMatch);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return res.status(200).send({
        success: true,
        message: "User Logined Successfully!",
        token,
      });
    } else {
      return res.status(404).send({
        success: false,
        message: "Invalid Credentials!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await userModel.findById(userId).select("-password");
    res.status(200).send({
      success: true,
      message: "Get Profile",
      userData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;
    if (!name || !phone || !address || !dob || !gender) {
      return res.status(400).send({
        success: false,
        message: "Details Missinf",
      });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: typeof address === "string" ? JSON.parse(address) : address,
      gender,
      dob,
    });

    if (imageFile) {
      // Upload Image to Cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

const listOfUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "All Users List",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error!",
    });
  }
};
const bookAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { docId, slotDate, slotTime } = req.body;

    if (!docId || !slotDate || !slotTime) {
      return res.status(400).json({
        success: false,
        message: "Missing booking details",
      });
    }

    const doctorData = await doctorModel.findById(docId);
    const userData = await userModel.findById(userId).select("-password");

    if (!doctorData || !userData) {
      return res.status(404).json({
        success: false,
        message: "Doctor or User not found",
      });
    }

    let slotsBooked = doctorData.slotsBooked || {};

    if (!slotsBooked[slotDate]) {
      slotsBooked[slotDate] = [];
    }

    if (slotsBooked[slotDate].includes(slotTime)) {
      return res.status(400).json({
        success: false,
        message: "Slot already booked",
      });
    }

    // ✅ Lock slot
    slotsBooked[slotDate].push(slotTime);

    await doctorModel.findByIdAndUpdate(docId, {
      slotsBooked,
    });

    // ✅ Save appointment
    const newAppointment = new appointmentModel({
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData: doctorData,
      amount: doctorData.fees,
      date: Date.now(),
      cancelled: false,
    });

    await newAppointment.save();

    res.json({
      success: true,
      message: "Appointment Booked",
    });
  } catch (error) {
    console.log("BOOK ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const listOfAppointments = async (req, res) => {
  try {
    const userId = req.userId;
    const appointments = await appointmentModel.find({ userId });
    res.status(200).send({
      success: true,
      message: "List of Appoitments",
      appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Erro!",
    });
  }
};
const cancelAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointmentData.userId.toString() !== userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    appointmentData.cancelled = true;
    await appointmentData.save();

    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slotsBooked = doctorData.slotsBooked || {};

    if (slotsBooked[slotDate]) {
      slotsBooked[slotDate] = slotsBooked[slotDate].filter(
        (time) => time !== slotTime,
      );
    }

    await doctorModel.findByIdAndUpdate(docId, {
      slotsBooked,
    });

    res.json({
      success: true,
      message: "Appointment Cancelled",
    });
  } catch (error) {
    console.log("CANCEL ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// API to make payment of Appointment

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    console.log("KEY ID:", process.env.RAZORPAY_KEY_ID);
    console.log("KEY SECRET:", process.env.RAZORPAY_KEY_SECRET);
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData || appointmentData.cancelled) {
      return res.status(400).send({
        success: false,
        message: "Appointment Cancelled!",
      });
    }
    // Creating Options for Razorpay payment

    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };

    // creation of an Order

    const order = await razorpayInstance.orders.create(options);
    res.status(200).send({
      success: true,
      message: "Order Created",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// Api to Verify payment of Razorpay

const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
      });
      res.status(200).send({
        success: true,
        message: "Payment Successfull",
        orderInfo,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Payment Failed!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

export {
  registerUser,
  userLogin,
  getUserProfile,
  updateUserProfile,
  listOfUsers,
  bookAppointment,
  listOfAppointments,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
};
