import express from "express";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import {
  bookAppointment,
  cancelAppointment,
  getUserProfile,
  listOfAppointments,
  listOfUsers,
  paymentRazorpay,
  registerUser,
  updateUserProfile,
  userLogin,
  verifyRazorpay,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";

const userRoute = express.Router();

userRoute.post("/user-registration", registerUser);
userRoute.post("/user-login", userLogin);
userRoute.get("/profile", authUser, getUserProfile);
userRoute.put(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateUserProfile,
);

userRoute.post("/book-appointment", authUser, bookAppointment);

userRoute.get("/all-users", authAdmin, listOfUsers);

userRoute.get("/list-appointments", authUser, listOfAppointments);
userRoute.post("/cancel-appointment", authUser, cancelAppointment);
userRoute.post("/payment-razorpay", authUser, paymentRazorpay);
userRoute.post("/verify-razorpay", authUser, verifyRazorpay);

export default userRoute;
