import mongoose from "mongoose";

const connection = async () => {
  await mongoose.connect("mongodb://localhost:27017/auth-with-passport");
  console.log("connected to mongodb");
}

export default connection;