# 个人博客系统 V1.0

一个功能完整的个人博客管理系统，采用前后端分离架构开发。

## 技术栈

### 前端
- React 18.2
- TypeScript
- React Router 6
- Axios
- Vite

### 后端
- Node.js
- Express
- JWT认证
- bcryptjs密码加密

## 功能特性

### V1.0 核心功能
- ✅ 用户登录认证系统
- ✅ 博客文章展示（列表+详情）
- ✅ 文章分类筛选
- ✅ 文章搜索功能
- ✅ 管理后台
  - 文章发布
  - 文章编辑
  - 文章删除
  - 草稿管理
  - 文章状态切换
- ✅ 响应式设计
- ✅ 现代化UI界面

## 快速开始

### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装依赖

1. 安装根目录依赖
\`\`\`bash
npm install
\`\`\`

2. 安装前端依赖
\`\`\`bash
cd client
npm install
cd ..
\`\`\`

### 运行项目

#### 开发模式（同时启动前后端）
\`\`\`bash
npm run dev
\`\`\`

服务将在以下地址启动：
- 前端：http://localhost:5173
- 后端：http://localhost:3000

#### 单独启动

启动后端服务器：
\`\`\`bash
npm run server
\`\`\`

启动前端开发服务器：
\`\`\`bash
npm run client
\`\`\`

### 构建生产版本
\`\`\`bash
npm run build
\`\`\`

### 默认账号
- 用户名：`admin`
- 密码：`admin123`

## 项目结构

\`\`\`
homework/
├── client/                 # 前端应用
│   ├── src/
│   │   ├── pages/         # 页面组件
│   │   │   ├── Login.tsx      # 登录页
│   │   │   ├── Blog.tsx       # 博客首页
│   │   │   ├── ArticleDetail.tsx  # 文章详情
│   │   │   └── Admin.tsx      # 管理后台
│   │   ├── services/      # API服务
│   │   │   └── api.ts
│   │   ├── App.tsx        # 主应用组件
│   │   └── main.tsx       # 入口文件
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── server/                # 后端服务
│   ├── routes/           # 路由
│   │   ├── auth.js       # 认证路由
│   │   └── articles.js   # 文章路由
│   ├── data/             # 数据管理
│   │   ├── users.js      # 用户数据
│   │   └── articles.js   # 文章数据
│   └── index.js          # 服务器入口
├── package.json          # 项目配置
└── README.md            # 项目文档
\`\`\`

## API接口

### 认证接口
- `POST /api/auth/login` - 用户登录

### 文章接口
- `GET /api/articles` - 获取所有文章
- `GET /api/articles/:id` - 获取单篇文章
- `POST /api/articles` - 创建文章（需要认证）
- `PUT /api/articles/:id` - 更新文章（需要认证）
- `DELETE /api/articles/:id` - 删除文章（需要认证）

## 使用说明

### 访客模式
1. 直接访问首页查看已发布的文章
2. 点击文章卡片查看文章详情
3. 使用侧边栏搜索和分类筛选功能

### 管理员模式
1. 点击"管理后台"按钮进入登录页
2. 使用默认账号登录
3. 在管理后台可以：
   - 新建文章
   - 编辑现有文章
   - 删除文章
   - 将文章保存为草稿或发布
   - 按状态筛选文章

## 数据存储

V1.0版本使用JSON文件存储数据：
- `server/data/users.json` - 用户数据
- `server/data/articles.json` - 文章数据

首次运行时会自动创建示例数据。

## 注意事项

1. 本项目为演示版本，生产环境需要：
   - 更改JWT密钥
   - 使用真实数据库（如MongoDB、PostgreSQL）
   - 添加更多安全措施
   - 配置HTTPS

2. 密码已使用bcrypt加密存储

3. JWT token有效期为7天

## 开发计划

查看 `ITERATION_PLAN.md` 了解下一版本的迭代计划。

## 许可证

MIT License

