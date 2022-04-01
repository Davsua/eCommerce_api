const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/database");

const productsInCart = sequelize.define("productsInCart", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
  },
  cartId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(12),
    allowNull: false,
    defaultValue: "active",
  },
});

module.exports = { productsInCart };
