import express from "express";

import cors from "cors";
import "dotenv/config";

import connectDb from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRoute from "./routes/doctorRoute.js";
import userRoute from "./routes/userRoute.js";
// app Config

const app = express();

const port = process.env.PORT || 4000;
connectDb();
connectCloudinary();
//middleware

app.use(express.json());
app.use(cors());

// API  End Points
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRoute);
app.use("/api/user", userRoute);

app.get("/", (req, res) => {
  res.send("API Working Successfully!");
});

app.listen(port, () => console.log("Server Started on Port ", port));
