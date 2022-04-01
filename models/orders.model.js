const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/database");

const Order = sequelize.define("order", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cartId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(12),
    allowNull: false,
    defaultValue: "active",
  },
  issuedAt: {
    type: DataTypes.STRING(225),
    allowNull: false,
  },
});

module.exports = { Order };
