import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected");
  } catch (error) {
    console.log("Error in connection to mongoDb", error.message);
    process.exit(1);
  }
};

export default connectMongoDB;
