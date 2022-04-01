const express = require("express");

const { authenticateSesion } = require("../middlewares/auth.middleware");
const {
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createNewProduct,
} = require("../controllers/products.controller");
const {
  productExist,
  productOwner,
} = require("../middlewares/products.middleware");
const {
  createProductValidator,
  validateResult,
} = require("../middlewares/validators.middleware");

const router = express.Router();

router.use(authenticateSesion);

router.post("/", createProductValidator, validateResult, createNewProduct);

router.get("/", getAllProducts);

router
  .use("/:id", productExist)
  .route("/:id")
  .get(productOwner, getProductById)
  .patch(productOwner, updateProduct)
  .delete(productOwner, deleteProduct);

module.exports = { productsRoutes: router };
