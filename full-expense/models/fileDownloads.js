const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const fileDownloads = sequelize.define("filedownloads", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  link: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = fileDownloads;
