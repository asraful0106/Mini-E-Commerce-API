import mongoose from "mongoose";
import { envVars } from "../config/env.js";

const connectToDb = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("Connected to databse!");
  } catch (err) {
    console.log("Unable to connect to the database!", err);
  }
};

export default connectToDb;
