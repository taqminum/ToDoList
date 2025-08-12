// server/db.js
const { sequelize } = require('./models/index'); // 从 models/index 导入实例

// 测试连接
sequelize.authenticate()
  .then(() => console.log('SQLite 连接成功'))
  .catch(err => console.error('连接失败:', err));

// 同步模型（从统一管理的模型同步）
sequelize.sync({ alter: true })
  .then(() => console.log('模型同步完成'))
  .catch(err => console.error('同步失败:', err));

module.exports = sequelize;