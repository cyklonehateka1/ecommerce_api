import mongoose from "mongoose";

export const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connection successfull");
  } catch (err) {
    console.log(err);
  }
};
