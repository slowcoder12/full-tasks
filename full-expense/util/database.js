const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense','root','Practicecode',{dialect:'mysql',host:'localhost'});

module.exports = sequelize;