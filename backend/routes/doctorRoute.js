import express from "express";
import {
  appointmentCancelled,
  appointmentComplete,
  appointmentsDoctor,
  doctorDashboard,
  doctorProfile,
  doctorsList,
  loginDoctor,
  updataDoctorProfile,
} from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";

const doctorRoute = express.Router();

doctorRoute.get("/list", doctorsList);
doctorRoute.post("/login-doctor", loginDoctor);
doctorRoute.get("/appointments", authDoctor, appointmentsDoctor);

doctorRoute.post("/appointment-complete", authDoctor, appointmentComplete);
doctorRoute.post("/appointment-cancel", authDoctor, appointmentCancelled);
doctorRoute.get("/doctor-dashboard", authDoctor, doctorDashboard);

doctorRoute.post("/profile", authDoctor, doctorProfile);
doctorRoute.post("/update-profile", authDoctor, updataDoctorProfile);
export default doctorRoute;
