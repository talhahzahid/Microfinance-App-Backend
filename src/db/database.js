import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectdb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}MICROFINACE`
    );
    console.log(`\nMONGO DB CONNECTED SUCCESSFULLY`);
  } catch (error) {
    console.log("MONGO DB CONNECTION FAILED", error);
    process.exit(1);
  }
};

export default connectdb;