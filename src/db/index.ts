import mongoose from "mongoose";

import { DB_NAME } from "../constants";

const dbConnection = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("DB connection established!");
  } catch (error) {
    console.log("ERROR IN DB CONNECTION:", error);
  }
};

export { dbConnection };
