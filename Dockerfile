# 多阶段构建 - 前端构建阶段
FROM node:18-alpine AS frontend-builder

WORKDIR /app/client

# 复制前端package.json
COPY client/package*.json ./

# 安装前端依赖
RUN npm ci --only=production

# 复制前端源码
COPY client/ ./

# 构建前端
RUN npm run build

# 后端运行阶段
FROM node:18-alpine

WORKDIR /app

# 安装生产依赖
COPY package*.json ./
RUN npm ci --only=production

# 复制后端代码
COPY server/ ./server/

# 从前端构建阶段复制构建产物
COPY --from=frontend-builder /app/client/dist ./client/dist

# 创建数据目录
RUN mkdir -p /app/server/data

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 启动应用
CMD ["node", "server/index.js"]

