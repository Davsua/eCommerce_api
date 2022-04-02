const { body } = require("express-validator");
const express = require("express");
const {
  getAllUsers,
  createNewUser,
  loginUser,
  updateUser,
  deleteUser,
  getUserById,
  getUserproducts,
  getOrdersByUserById,
} = require("../controllers/users.controller");
const { authenticateSesion } = require("../middlewares/auth.middleware");
const {
  userExist,
  protectAccountOwner,
} = require("../middlewares/user.middleware");
const {
  createUserValidator,
  validateResult,
} = require("../middlewares/validators.middleware");

const router = express.Router();

router.post("/", createUserValidator, validateResult, createNewUser);

router.post("/login", loginUser);

router.use(authenticateSesion);

router.get("/", getAllUsers);

router.get("/me", getUserproducts);

router.get("/orders", getOrdersByUser);

router.get("/orders/:id", getOrdersByUserById);

//siempre deben estar al final ya que :id es un parametro dinamico
//node puede asimila una ruta como este parametro dinamico por ende puede
//generar un error (EL ORDEN IMPORTA)
router
  .use("/:id", userExist)
  .route("/:id")
  .get(getUserById)
  .patch(protectAccountOwner, updateUser)
  .delete(protectAccountOwner, deleteUser);

module.exports = { usersRoutes: router };
