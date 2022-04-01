const express = require("express");
const { cartsRoutes } = require("./routes/cart.routes");
const { productsRoutes } = require("./routes/product.route");
const { usersRoutes } = require("./routes/users.route");

const { globalErrorHandler } = require("./utils/errorHandler");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", usersRoutes);

app.use("/api/v1/products", productsRoutes);

app.use("/api/v1/carts", cartsRoutes);

app.use(globalErrorHandler);

module.exports = { app };
