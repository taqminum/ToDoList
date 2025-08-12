const express = require('express');
const cors = require('cors');
const sequelize = require('./db'); // 导入连接
const { User, Todo } = require('./models/index'); // 从统一入口导入模型

// 导入路由
const todoRoutes = require('./routes/todo.routes');
const authRoutes = require('./routes/auth.routes');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());

// 挂载路由
app.use('/api/todos', todoRoutes);
app.use('/api/auth', authRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});