const { User } = require("../models/user.model");
const { AppError } = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

exports.userExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: { id, status: "active" },
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    next(new AppError(400, "user not found"));
  }

  req.user = user;
  next();
});

exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const { currentUser } = req;

  if (currentUser.id !== +id) {
    return next(new AppError(403, "Access denied, its not your profile"));
  }

  next();
});
