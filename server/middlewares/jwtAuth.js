import jwt from "jsonwebtoken";
import { errorHandler } from "./errorHandler.js";

export const jwtAuth = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, "You're not authenticated"));

  jwt.verify(token, process.env.JWT_SEC, (err, user) => {
    if (err) return next(errorHandler(403, "You're not authorized"));
    req.user = user;
    next();
  });
};
