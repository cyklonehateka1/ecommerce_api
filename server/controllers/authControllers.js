import UserSchema from "../models/UserModel.js";
import { errorHandler } from "../middlewares/errorHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import TokenSchema from "../models/TokenModel.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return next(400, "Some fields are required");
    const checkForUser = await UserSchema.findOne({ email: req.body.email });
    if (checkForUser) return next(errorHandler(409, "Email already used"));

    const checkForPhone = await UserSchema.findOne({ phone: req.body.phone });
    if (checkForPhone)
      return next(errorHandler(409, "Phone number already used"));

    //   Hash password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(req.body.password, salt);

    let user = new UserSchema({ ...req.body, password: hash });
    user = await user.save();

    const token = await new TokenSchema({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const url = `${process.env.BASE_URL}/api/auth/user/${user._id}/verify/${token.token}`;
    await sendEmail(user.email, "Verify Email", url);

    return res
      .status(201)
      .json(
        "An email has been sent to you, please click on the in it to verify your account"
      );
  } catch (error) {
    return next(error);
  }
};

export const verifyEmailToken = async (req, res, next) => {
  try {
    const user = await UserSchema.findOne({ _id: req.params.id });
    if (!user) return res.status(400).json("invalid user");
    const token = await TokenSchema.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link");

    await UserSchema.findByIdAndUpdate(req.params.id, {
      $set: { isVerified: true },
    });
    await token.remove();

    res.status(200).json("email verified successfully");
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await UserSchema.findOne({ email: req.body.email });
    if (!user) return next(errorHandler(400, "invalid email"));
    const userPassword = bcrypt.compareSync(req.body.password, user.password);
    if (!userPassword) return next(errorHandler(400, "Password is incorrect"));

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        isSuperUser: user.isSuperUser,
        isVerified: user.isVerified,
      },
      process.env.JWT_SEC,
      { expiresIn: "30d" }
    );

    if (!user.isVerified) {
      let token = await TokenSchema.findOne({ userId: user._id });
      if (!token) {
        const token = await new TokenSchema({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const url = `${process.env.BASE_URL}/api/auth/user/${user._id}/verify${token.token}`;
        await sendEmail(user.email, "Verify Email", url);
      }
      return res
        .status(400)
        .json(
          "An email has been sent to your account, please click on the in it to verify your account"
        );
    }

    const { password, ...others } = user._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(others);
  } catch (error) {
    return next(error);
  }
};
