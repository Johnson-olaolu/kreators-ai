import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const ConnectDB = async () => {
  if (!process.env.MONGO_DB_URI) {
    console.log("No MongoDB URI found");
    process.exit(1);
  }
  const connURI = process.env.MONGO_DB_URI;
  const conn = await mongoose.connect(connURI, {});

  if (conn) {
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } else {
    console.log("Error connecting to db");
  }
};

export default ConnectDB;
