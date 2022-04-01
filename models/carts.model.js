const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/database");

const Carts = sequelize.define("carts", {
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
  status: {
    type: DataTypes.STRING(11),
    allowNull: false,
    defaultValue: "active",
  },
});

module.exports = { Carts };
