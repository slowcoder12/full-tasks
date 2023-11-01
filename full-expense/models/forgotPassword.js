const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const forgotPasswordReq = sequelize.define("forgotPasswordRequest", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = forgotPasswordReq;
