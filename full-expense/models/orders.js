const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Orders = sequelize.define("orders", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  paymentId: Sequelize.STRING,
  orderId: Sequelize.STRING,
  status: Sequelize.STRING,
});

module.exports = Orders;
