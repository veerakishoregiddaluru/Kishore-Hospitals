// API for Adding Doctor
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { v2 as cloudinary } from "cloudinary";
import upload from "../middlewares/multer.js";

import doctorModel from "../models/doctorModel.js";
import { json } from "express";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      available,
    } = req.body;

    const imageFile = req.file;
    console.log(
      {
        name,
        email,
        password,
        speciality,
        degree,
        experience,
        about,
        fees,
        address,
        available,
      },
      imageFile,
    );

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address ||
      !available
    ) {
      return res.status(404).send({
        success: false,
        message: "Missing Details",
      });
    }

    // Validating Email Format

    if (!validator.isEmail(email)) {
      return res.status(404).send({
        success: false,
        message: "Please Enter Valid Email",
      });
    }

    if (password.length < 8) {
      return res.status(404).send({
        success: false,
        message: "Please Enter a Strong Password",
      });
    }

    // hashing Doctor Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Upload Image to CLoudinary

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
      available,
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    return res.status(200).send({
      success: true,
      message: "Doctor Added Successfully",
      newDoctor,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error! ",
    });
  }
};
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Entered:", email, password);
    console.log("Env:", process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);

    // Check credentials
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD,
        process.env.JWT_SECRET,
      );

      return res.status(200).json({
        success: true,
        message: "Login Successful",
        token,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.status(200).send({
      success: true,
      message: "All Doctors",
      doctors,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// Api to get All Doctors Appointments

const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});

    return res.status(200).json({
      success: true,
      message: "All Appointments",
      appointments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// API for Appointment Cancellation

const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Missing appointmentId",
      });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // Releasing Doctor Slot
    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slotsBooked = doctorData.slotsBooked || {};

    if (slotsBooked[slotDate]) {
      slotsBooked[slotDate] = slotsBooked[slotDate].filter(
        (e) => e !== slotTime,
      );
    }

    await doctorModel.findByIdAndUpdate(docId, { slotsBooked });

    res.status(200).json({
      success: true,
      message: "Appointment Cancelled",
    });
  } catch (error) {
    console.log("Cancel Error:", error); // 👈 check this in terminal
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    // 1. Validate input
    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Missing appointmentId",
      });
    }

    // 2. Check appointment exists
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // 3. Update status
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isCompleted: true,
    });

    res.status(200).json({
      success: true,
      message: "Appointment Completed",
    });
  } catch (error) {
    console.log("Complete Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API to get Dashboard Data for Admin Panel

const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});
    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppoitments: appointments.reverse().slice(0, 5),
    };
    res.status(200).send({
      success: true,
      message: "Admin Dashboard",
      dashData,
    });
  } catch (error) {
    console.log("Cancel Error:", error); // 👈 check this in terminal
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  addDoctor,
  adminLogin,
  allDoctors,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
  appointmentComplete,
};
