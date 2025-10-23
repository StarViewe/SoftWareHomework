# 快速启动指南

## 🚀 5分钟快速开始

### 前置要求
- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装步骤

#### 1. 安装依赖
\`\`\`bash
# 安装后端依赖
npm install

# 安装前端依赖
cd client
npm install
cd ..
\`\`\`

#### 2. 启动项目
\`\`\`bash
# 一键启动前后端（推荐）
npm run dev
\`\`\`

服务将在以下地址启动：
- 🌐 **前端地址：** http://localhost:5173
- 🔌 **后端API：** http://localhost:3000/api

#### 3. 访问系统

**博客首页：** http://localhost:5173
- 查看文章列表
- 搜索和筛选文章
- 阅读文章详情

**管理后台：** http://localhost:5173/admin
- 需要先登录
- 管理文章：创建、编辑、删除
- 草稿管理

### 默认登录信息
```
用户名：admin
密码：admin123
```

---

## 📖 使用流程

### 作为访客
1. 打开首页 http://localhost:5173
2. 浏览文章列表
3. 点击文章卡片查看详情
4. 使用搜索框搜索文章
5. 点击分类筛选文章

### 作为管理员
1. 点击"管理后台"按钮
2. 使用默认账号登录
3. 点击"新建文章"创建文章
4. 填写标题、分类、内容
5. 选择"草稿"或"发布"
6. 在列表中编辑或删除文章

---

## 🛠️ 开发命令

\`\`\`bash
# 同时启动前后端
npm run dev

# 仅启动后端
npm run server

# 仅启动前端
npm run client

# 构建前端生产版本
npm run build
\`\`\`

---

## 📁 数据文件

系统使用JSON文件存储数据，位于：
- `server/data/users.json` - 用户数据
- `server/data/articles.json` - 文章数据

首次运行会自动创建示例数据。

---

## 🔧 常见问题

### 端口已被占用
如果3000或5173端口被占用，可以修改：
- 后端端口：修改 `server/index.js` 中的 `PORT`
- 前端端口：修改 `client/vite.config.ts` 中的 `server.port`

### 依赖安装失败
尝试清理缓存后重新安装：
\`\`\`bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
\`\`\`

### 前端无法连接后端
检查 `client/vite.config.ts` 中的代理配置是否正确。

---

## 📚 相关文档

- **完整文档：** [README.md](README.md)
- **项目报告：** [PROJECT_REPORT_V1.0.md](PROJECT_REPORT_V1.0.md)
- **迭代计划：** [ITERATION_PLAN.md](ITERATION_PLAN.md)

---

## 💡 提示

1. **修改密码：** 登录后建议修改默认密码（V2.0将支持）
2. **数据备份：** 定期备份 `server/data/` 目录
3. **生产部署：** 参考 README.md 的部署说明

---

## 🎉 开始使用

现在你已经准备好了！打开浏览器访问 http://localhost:5173 开始使用吧！

有问题？查看 [README.md](README.md) 获取更多帮助。

