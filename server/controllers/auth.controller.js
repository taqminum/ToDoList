const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/index'); // 从统一入口导入 User 模型
const dotenv = require('dotenv');
dotenv.config();

// 注册接口
exports.register = async (req, res) => {
  try {
    // 检查用户是否已存在
    const existingUser = await User.findOne({ where: { username: req.body.username } });
    if (existingUser) {
      return res.status(400).json({ msg: '用户名已存在' });
    }

    // 密码加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // 创建用户
    const newUser = await User.create({
      username: req.body.username,
      password: hashedPassword,
    });

    res.status(201).json({ msg: '注册成功', user: newUser });
  } catch (err) {
    res.status(500).json({ msg: '服务器错误', error: err.message });
  }
};

// 登录接口
exports.login = async (req, res) => {
  try {
    // 查找用户
    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user) {
      return res.status(400).json({ msg: '用户名或密码错误' });
    }

    // 验证密码
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: '用户名或密码错误' });
    }

    // 生成 JWT Token（有效期1小时）
    const token = jwt.sign(
      { userId: user.id }, //  payload：用户 ID
      process.env.JWT_SECRET, 
      { expiresIn: '6h' }
    );

    res.json({ token, userId: user.id });
  } catch (err) {
    res.status(500).json({ msg: '服务器错误', error: err.message });
  }
};