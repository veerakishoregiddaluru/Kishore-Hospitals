import mongoose from "mongoose";

const connectDb = async () => {
  await mongoose.connect(process.env.MONGO_DB, {
    dbName: "kishorehospitals", // 🔥 FORCE DB NAME
  });

  console.log("Database Connected");
};

export default connectDb;
