// server/models/user.model.js
const { DataTypes } = require('sequelize');

// 延迟导入 db.js，避免循环依赖
let sequelize;
function getSequelize() {
  if (!sequelize) {
    sequelize = require('../db.js'); // 此时 db.js 已完全初始化
  }
  return sequelize;
}

// 用函数获取的 sequelize 实例定义模型
const User = getSequelize().define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = User;