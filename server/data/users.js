const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const USERS_FILE = path.join(__dirname, 'users.json');

// 初始化用户数据
const initUsers = async () => {
  const defaultPassword = await bcrypt.hash('admin123', 10);
  return [
    {
      id: '1',
      username: 'admin',
      password: defaultPassword
    }
  ];
};

// 获取用户列表
const getUsers = () => {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      const defaultUsers = [
        {
          id: '1',
          username: 'admin',
          // 默认密码：admin123 的hash值
          password: '$2a$10$XQPYz8qR1gKQY6zGQPYz8O3YzQYz8qR1gKQY6zGQPYz8O3YzQYz8O'
        }
      ];
      fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
      return defaultUsers;
    }
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

// 保存用户列表
const saveUsers = (users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

// 添加用户
const addUser = async (username, password) => {
  const users = getUsers();
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(),
    username,
    password: hashedPassword
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

module.exports = {
  getUsers,
  saveUsers,
  addUser
};

