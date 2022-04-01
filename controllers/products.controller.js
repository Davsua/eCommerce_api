const { Products } = require("../models/products.model");
const { Carts } = require("../models/carts.model");

const { catchAsync } = require("../utils/catchAsync");
const { filterObj } = require("../utils/filterObjects");

const { AppError } = require("../utils/appError");
const { User } = require("../models/user.model");

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Products.findAll({
    where: { status: "active" },
    include: [{ model: User, attributes: { exclude: "password" } }],
  });

  res.status(200).json({
    status: "succes",
    data: products,
  });
});

exports.getProductById = catchAsync(async (req, res, next) => {
  const { product } = req;

  res.status(200).json({
    status: "succes",
    data: product,
  });
});

exports.createNewProduct = catchAsync(async (req, res, next) => {
  const { title, description, quantity, price, status, userId } = req.body;
  const { id } = req.currentUser; //logged user id

  if (!title || !description || !quantity || !price) {
    return next(new AppError(400, "you must provide all fields"));
  }

  const newProduct = await Products.create({
    title,
    description,
    quantity,
    price,
    status,
    userId: id, //take the id by logged user
  });

  res.status(200).json({
    status: "succes",
    data: { newProduct },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  const data = filterObj(req.body, "title", "description", "price", "quantity");

  await product.update({ ...data });

  res.status(200).json({
    status: "succes",
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  (await product).update({ status: "delete" });

  res.status(200).json({
    status: "succes",
  });
});
