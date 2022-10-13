import User from "../models/user";
import { hashPassword, comparePassword } from "../util/auth";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //validate
    if (!name) return res.status(400).send("Name is required");
    if (!password || password.length < 6) {
      return res.status(400).send("Password mus be at leas 6 characters long");
    }
    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send("Email is taken");

    //hash pass
    const hashedPassword = await hashPassword(password);
    //register
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    console.log("saved user ", user);
    return res.json({ valid: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check for user
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).send("no user found");
    // check for pass
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send("wrong password");
    // create jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // return user and token, exluce pass
    user.password = undefined;
    // cookie
    res.cookie("token", token, {
      httpOnly: true,
      // secure:true, // only work on https
    });
    // send user as json
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send("error");
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Logged Out" });
  } catch (err) {
    console.log(err);
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").exec();
    console.log("current user", user);
    return res.json({ valid: true });
  } catch (err) {
    console.log(err);
  }
};
