const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const { v4: uuidv4 } = require('uuid');

// 数据文件路径
const USERS_FILE = path.join(__dirname, '../data/users.json');

// 确保数据文件存在
if (!fs.existsSync(USERS_FILE)) {
  // 初始数据
  const initialUsers = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456', 10),
      nickname: '管理员',
      phone: '13800138000',
      gender: 1,
      userType: 2
    }
  ];
  fs.writeFileSync(USERS_FILE, JSON.stringify(initialUsers, null, 2));
}

// 加载用户数据
const loadUsers = () => {
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  return JSON.parse(data);
};

// 保存用户数据
const saveUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// 模拟用户数据
let users = loadUsers();

const userController = {
  // 注册
  register: async (req, res) => {
    try {
      const { username, email, password, nickname, phone, gender, userType } = req.body;
      
      // 检查用户是否已存在
      const existingUser = users.find(user => user.username === username || user.email === email);
      if (existingUser) {
        return res.status(400).json({ code: 400, message: '用户名或邮箱已存在' });
      }
      
      // 密码加密
      const hashedPassword = bcrypt.hashSync(password, 10);
      
      // 使用dayjs生成基于时间戳的用户ID
      const timestamp = dayjs().format('YYYYMMDDHHmmss');
      const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const userId = `${timestamp}${randomSuffix}`;
      
      // 创建新用户
      const newUser = {
        id: userId,
        username,
        email,
        password: hashedPassword,
        nickname: nickname || username,
        phone,
        gender,
        userType
      };
      
      users.push(newUser);
      saveUsers(users); // 保存到文件
      
      res.status(200).json({ code: 200, message: '注册成功' });
    } catch (error) {
      console.error('注册失败:', error);
      res.status(500).json({ code: 500, message: '注册失败' });
    }
  },
  
  // 登录
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // 重新加载用户数据，确保包含新注册的用户
      users = loadUsers();
      
      // 查找用户
      const user = users.find(user => user.username === username);
      if (!user) {
        return res.status(400).json({ code: 400, message: '用户不存在' });
      }
      
      // 验证密码
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ code: 400, message: '密码错误' });
      }
      
      // 生成token
      const token = jwt.sign({ userId: user.id, userType: user.userType }, 'secret_key', { expiresIn: '24h' });
      
      res.status(200).json({
        code: 200,
        message: '登录成功',
        data: {
          token,
          userInfo: {
            id: user.id,
            username: user.username,
            email: user.email,
            nickname: user.nickname,
            phone: user.phone,
            gender: user.gender,
            userType: user.userType
          }
        }
      });
    } catch (error) {
      console.error('登录失败:', error);
      res.status(500).json({ code: 500, message: '登录失败' });
    }
  },
  
  // 登出
  logout: async (req, res) => {
    try {
      // 前端清除token即可，后端不需要特殊处理
      res.status(200).json({ code: 200, message: '登出成功' });
    } catch (error) {
      console.error('登出失败:', error);
      res.status(500).json({ code: 500, message: '登出失败' });
    }
  }
};

module.exports = userController;