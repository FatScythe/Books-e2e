const User = require("../models/User");
const { BadRequestError, NotFoundError } = require("../errors");
const jwt = require("jsonwebtoken");
const attachCookieToResponse = require("../utils/attachCookie");

const register = async (req, res) => {
  /*  
    This function takes 3 values from the request body (name, email, password),
     validates them, hashes the password and then adds a new user to the database, 
     NB: if there are no user in the database it makes the first user's role an "admin".
  */
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("Please provide name, email and password!");
  }

  const isFirstUser = (await User.countDocuments({})) === 0;
  const role = isFirstUser ? "admin" : "user";

  const user = await User.create({ name, email, password, role });

  res.status(201).json({
    success: true,
    message: "User created",
    user: { userId: user._id, name, email, role },
  });
};

const login = async (req, res) => {
  /*  
    This function takes 2 values (email and password) from the request body, validates them, 
    search for one instance on the db having the same email,
    compares the password from the request with the one on the db and 
    then attaches a cookie that expires in a day to the response object
  */
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide name, email and password!");
  }

  const user = await User.findOne({ email });

  if (!user) throw new NotFoundError("Invalid Credentials!");

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) throw new BadRequestError("Invalid Credentials!");

  // Can commment to test
  attachCookieToResponse(res, user);

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: { userId: user._id, name: user.name, role: user.role },
  });
};

const logout = async (req, res) => {
  /*  
    This function log's out user by sending a token 
    with a much shorter or negligble expiry time
  */

  // Can commment to test
  res.cookie("token", "logout", {
    expires: new Date(Date.now()),
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

module.exports = { register, login, logout };
