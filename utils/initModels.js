const { Carts } = require("../models/carts.model");
const { User } = require("../models/user.model");
const { Products } = require("../models/products.model");
const { Order } = require("../models/orders.model");
const { productsInCart } = require("../models/productsInCar.model");

const initModels = () => {
  User.hasMany(Products);
  Products.belongsTo(User);

  User.hasMany(Order);
  Order.belongsTo(User);

  User.hasOne(Carts);
  Carts.belongsTo(User);

  Carts.belongsToMany(Products, { through: productsInCart });
  Products.belongsToMany(Carts, { through: productsInCart });

  Carts.hasOne(Order);
  Order.belongsTo(Carts);
};

module.exports = { initModels };
