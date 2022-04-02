const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const { User } = require("../models/user.model");

const { catchAsync } = require("../utils/catchAsync");
const { filterObj } = require("../utils/filterObjects");

const { AppError } = require("../utils/appError");
const { Products } = require("../models/products.model");
const { Order } = require("../models/orders.model");
const { Carts } = require("../models/carts.model");

dotenv.config({ path: "./config.env" });

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: "password" },
    include: { model: Products },
  });

  res.status(200).json({
    status: "succes",
    data: users,
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({
    status: "succes",
    data: user,
  });
});

exports.getUserproducts = catchAsync(async (req, res, next) => {
  const { id } = req.currentUser;
  console.log(id);

  const products = await Products.findAll({
    where: { userId: id },
  });

  res.status(200).json({
    status: "succes",
    data: products,
  });
});

exports.getOrdersByUser = catchAsync(async (req, res, next) => {
  const { currentUser } = req;

  const orders = (user = await Order.findAll({
    where: { userId: currentUser.id },
  }));

  res.status(200).json({
    status: "succes",
    data: user,
  });
});

exports.getOrdersByUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findOne({
    where: { id },
    include: [{ model: Carts, include: { model: Products } }],
  });

  if (!order) {
    return next(new AppError(400, "order doesnt exist"));
  }

  res.status(200).json({
    status: "succes",
    data: order,
  });
});

exports.createNewUser = catchAsync(async (req, res, next) => {
  const { username, email, password, status } = req.body;

  if (!username || !email || !password) {
    return next(new AppError(400, "you must provide all fields"));
  }

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    email,
    password: hashPassword,
    status,
  });

  newUser.password = undefined;

  res.status(200).json({
    status: "succes",
    data: { newUser },
  });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email, status: "active" },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError(400, "credentials are invalid"));
  }

  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: "succes",
    data: token,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  const data = filterObj(req.body, "username", "email", "password");

  await user.update({ ...data });

  res.status(200).json({
    status: "succes",
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  (await user).update({ status: "delete" });

  res.status(200).json({
    status: "succes",
  });
});
