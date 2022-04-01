const { body, validationResult } = require("express-validator");
const { AppError } = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");

exports.createProductValidator = [
  body("title").isString().notEmpty().withMessage("must provide the title"),
  body("description")
    .isString()
    .notEmpty()
    .withMessage("must provide the description"),
  body("quantity")
    .isNumeric()
    .notEmpty()
    .withMessage("must be provide the quantity")
    .custom((value) => value > 0)
    .withMessage("price cant be 0 or less"),
  body("price")
    .isNumeric()
    .notEmpty()
    .withMessage("must provide the price")
    .custom((value) => value > 0)
    .withMessage("price cant be 0 or less"),
];

exports.createUserValidator = [
  body("username")
    .isString()
    .notEmpty()
    .withMessage("must provide the username"),
  body("email").isString().notEmpty().withMessage("must provide the email"),
];

exports.addProductToCartValidator = [
  body("productId")
    .isNumeric()
    .notEmpty()
    .custom((val) => val < 0)
    .withMessage("must provide the productId, and it must be greater than 0"),
  body("quantity")
    .isNumeric()
    .custom((val) => val > 0)
    .withMessage("it must be greater than 0"),
];

exports.validateResult = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMsg = errors
      .array()
      .map(({ msg }) => msg)
      .join(". ");

    return next(new AppError(400, errorMsg));
  }

  next();
});
