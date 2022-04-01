const { Products } = require("../models/products.model");
const { AppError } = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

exports.productExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Products.findOne({
    where: { id, status: "active" },
  });

  if (!product) {
    next(new AppError(400, "product not found"));
  }

  req.product = product;
  next();
});

exports.productOwner = catchAsync(async (req, res, next) => {
  const { currentUser, product } = req; //find current user id, and product

  if (currentUser.id !== product.userId) {
    return next(new AppError(403, "youre not the owner of this product"));
  }

  next();
});
