const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); // 读取 .env 中的 JWT_SECRET

// JWT 认证中间件
const authenticateToken = (req, res, next) => {
  // 从请求头获取 Token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'Token 缺失' });
  }

  // 验证 Token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ msg: 'Token 无效' });
    }
    req.user = user; // 将用户信息挂载到 req，供后续接口使用
    next();
  });
};

module.exports = authenticateToken;