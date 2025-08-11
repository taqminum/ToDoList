const { Sequelize } = require('sequelize');
const dbConfig = require('./config/db.config');

const sequelize = new Sequelize({
  dialect: dbConfig.dialect,
  storage: dbConfig.storage,
  logging: console.log // 开发环境显示SQL日志
});

module.exports = sequelize;