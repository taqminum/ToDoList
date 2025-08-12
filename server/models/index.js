// server/models/index.js
const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db.config');

// 1. 单独创建 sequelize 实例（这里是真正的源头）
const sequelize = new Sequelize({
  dialect: dbConfig.dialect,
  storage: dbConfig.storage,
  logging: console.log
});

// 2. 定义模型（直接在这里定义，不单独引用 db.js）
const User = sequelize.define('User', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const Todo = sequelize.define('Todo', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  completed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  userId: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
});

// 3. 关联模型（如果需要）
User.hasMany(Todo);
Todo.belongsTo(User);

// 4. 导出实例和模型
module.exports = {
  sequelize,
  User,
  Todo
};