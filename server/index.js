import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

app.listen("6000", () => {
  console.log("Server started on PORT 6000");
});
