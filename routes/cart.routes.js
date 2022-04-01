const express = require("express");
const {
  addProductToCart,
  getAllCarts,
  deleteCart,
  getUserCart,
  updateCartProduct,
  removeProductFromCart,
} = require("../controllers/cart.controller");

const { authenticateSesion } = require("../middlewares/auth.middleware");
const { cartExist } = require("../middlewares/cart.middleware");

const {
  addProductToCartValidator,
  validateResult,
} = require("../middlewares/validators.middleware");

const router = express.Router();

router.use(authenticateSesion);

router.post(
  "/add-product",
  addProductToCartValidator,
  validateResult,
  addProductToCart
);

router.get("/", getUserCart);

router.delete("/:productId", removeProductFromCart);

router.patch("/update-products", updateCartProduct);

module.exports = { cartsRoutes: router };
