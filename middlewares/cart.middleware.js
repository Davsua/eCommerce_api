const { Carts } = require("../models/carts.model");
const { AppError } = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

exports.cartExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const cart = await Carts.findOne({
    where: { id, status: "active" },
  });

  if (!cart) {
    next(new AppError(400, "cart not found"));
  }

  req.cart = cart;
  next();
});
