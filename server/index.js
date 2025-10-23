const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器运行正常' });
});

// 生产环境：提供前端静态文件
if (isProduction) {
  const clientPath = path.join(__dirname, '../client/dist');
  
  // 静态文件服务
  app.use(express.static(clientPath));
  
  // SPA路由：所有非API请求都返回index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误' });
});

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`环境: ${isProduction ? '生产环境' : '开发环境'}`);
  console.log(`API地址: http://localhost:${PORT}/api`);
  if (isProduction) {
    console.log(`前端地址: http://localhost:${PORT}`);
  }
});

