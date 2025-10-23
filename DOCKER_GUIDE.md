# Docker部署快速指南

这是一个简化版的Docker部署指南，帮助您快速理解和使用Docker部署博客系统。

---

## 🎯 部署流程总览

```
本地开发机                华为云镜像仓库              云服务器
    │                          │                        │
    ├─ 1.构建镜像 ───────────▶│                        │
    │                          │                        │
    ├─ 2.推送镜像 ───────────▶│                        │
    │                          │                        │
    │                          │◀─── 3.拉取镜像 ────── │
    │                          │                        │
    │                          │         4.运行容器 ───▶│
```

---

## 📦 第一部分：本地构建和推送镜像

### 步骤1：准备工作

确保已安装Docker：
```bash
# Windows: 下载安装 Docker Desktop
# 验证安装
docker --version
```

### 步骤2：构建镜像

```bash
# 在项目根目录（homework文件夹）执行
cd homework

# 构建镜像（会花费几分钟）
docker build -t personal-blog:v1.0 .

# 查看构建好的镜像
docker images | grep personal-blog
```

### 步骤3：登录华为云镜像仓库

**获取登录凭证：**
1. 登录 [华为云控制台](https://console.huaweicloud.com)
2. 搜索"容器镜像服务" (SWR)
3. 点击右上角"客户端上传下载指令"
4. 复制登录命令

**登录：**
```bash
# 使用华为云提供的命令登录（示例）
docker login -u cn-north-4@你的AK -p 你的密码 swr.cn-north-4.myhuaweicloud.com
```

### 步骤4：标记镜像

```bash
# 替换为你的实际信息
# 格式：镜像仓库地址/组织名称/镜像名称:标签
docker tag personal-blog:v1.0 swr.cn-north-4.myhuaweicloud.com/personal-blog/blog-app:v1.0
docker tag personal-blog:v1.0 swr.cn-north-4.myhuaweicloud.com/personal-blog/blog-app:latest
```

### 步骤5：推送镜像

```bash
# 推送到华为云
docker push swr.cn-north-4.myhuaweicloud.com/personal-blog/blog-app:v1.0
docker push swr.cn-north-4.myhuaweicloud.com/personal-blog/blog-app:latest
```

✅ **完成！** 镜像已上传到华为云

---

## 🚀 第二部分：服务器部署

### 步骤1：连接到服务器

```bash
# 使用SSH连接（Windows可使用PowerShell或PuTTY）
ssh root@你的服务器IP
```

### 步骤2：安装Docker

```bash
# 一键安装Docker
curl -fsSL https://get.docker.com | sh

# 启动Docker
systemctl start docker
systemctl enable docker

# 安装Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

### 步骤3：登录华为云镜像仓库

```bash
# 使用相同的登录命令
docker login -u cn-north-4@你的AK -p 你的密码 swr.cn-north-4.myhuaweicloud.com
```

### 步骤4：创建部署目录

```bash
# 创建应用目录
mkdir -p /opt/personal-blog
cd /opt/personal-blog

# 创建数据和日志目录
mkdir -p data logs
```

### 步骤5：创建docker-compose.yml

```bash
# 创建配置文件
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  blog:
    image: swr.cn-north-4.myhuaweicloud.com/personal-blog/blog-app:latest
    container_name: personal-blog
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - JWT_SECRET=请修改为随机字符串
    volumes:
      - ./data:/app/server/data
      - ./logs:/app/logs
EOF
```

**重要：** 修改JWT_SECRET为随机字符串

### 步骤6：启动服务

```bash
# 拉取镜像
docker-compose pull

# 启动容器
docker-compose up -d

# 查看运行状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 步骤7：配置防火墙

```bash
# 开放3000端口（如果使用Nginx反向代理，开放80端口）
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --reload

# 或使用UFW
ufw allow 3000/tcp
```

### 步骤8：访问博客

在浏览器访问：`http://你的服务器IP:3000`

✅ **部署完成！**

---

## 🔄 更新部署

### 本地更新流程

```bash
# 1. 修改代码后，重新构建
docker build -t personal-blog:v1.1 .

# 2. 标记新版本
docker tag personal-blog:v1.1 swr.cn-north-4.myhuaweicloud.com/personal-blog/blog-app:v1.1
docker tag personal-blog:v1.1 swr.cn-north-4.myhuaweicloud.com/personal-blog/blog-app:latest

# 3. 推送新版本
docker push swr.cn-north-4.myhuaweicloud.com/personal-blog/blog-app:v1.1
docker push swr.cn-north-4.myhuaweicloud.com/personal-blog/blog-app:latest
```

### 服务器更新流程

```bash
# 进入部署目录
cd /opt/personal-blog

# 拉取最新镜像
docker-compose pull

# 重启服务
docker-compose up -d

# 查看日志确认
docker-compose logs -f
```

---

## 🛠️ 常用命令

### 查看状态
```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 查看资源使用
docker stats
```

### 服务管理
```bash
# 停止服务
docker-compose stop

# 启动服务
docker-compose start

# 重启服务
docker-compose restart

# 删除容器（保留数据）
docker-compose down
```

### 数据管理
```bash
# 备份数据
cd /opt/personal-blog
tar -czf backup-$(date +%Y%m%d).tar.gz data/

# 恢复数据
tar -xzf backup-20240101.tar.gz
```

---

## 🎨 使用一键部署脚本（推荐）

项目提供了自动化部署脚本：

### 本地操作
```bash
# 给脚本执行权限
chmod +x deploy.sh

# 构建并推送镜像
bash deploy.sh build
```

### 服务器操作
```bash
# 上传deploy.sh和docker-compose.yml到服务器
# 然后执行

# 拉取并启动
bash deploy.sh pull

# 更新服务
bash deploy.sh update

# 查看日志
bash deploy.sh logs
```

---

## 🔧 故障排查

### 问题1：容器无法启动

```bash
# 查看详细日志
docker-compose logs

# 检查端口占用
netstat -tlnp | grep 3000

# 检查镜像是否存在
docker images
```

### 问题2：无法访问服务

```bash
# 检查容器是否运行
docker ps

# 检查端口映射
docker port personal-blog

# 检查防火墙
firewall-cmd --list-all
# 或
ufw status
```

### 问题3：推送镜像失败

```bash
# 重新登录
docker logout swr.cn-north-4.myhuaweicloud.com
docker login -u xxx -p xxx swr.cn-north-4.myhuaweicloud.com

# 检查镜像标签是否正确
docker images
```

---

## 📋 华为云SWR操作步骤

### 创建组织和镜像仓库

1. **登录华为云控制台**
   - 访问 https://console.huaweicloud.com

2. **进入容器镜像服务**
   - 搜索"SWR"或"容器镜像服务"
   - 选择区域（建议：华北-北京四）

3. **创建组织**
   - 点击"创建组织"
   - 组织名称：`personal-blog`
   - 点击"确定"

4. **创建镜像仓库**
   - 进入组织
   - 点击"创建镜像仓库"
   - 仓库名称：`blog-app`
   - 类型：私有
   - 点击"确定"

5. **获取登录指令**
   - 点击右上角"客户端上传下载指令"
   - 复制登录命令

---

## 🎯 完整示例

### 场景：首次部署

**本地操作：**
```bash
# 1. 构建镜像
cd homework
docker build -t personal-blog:v1.0 .

# 2. 登录华为云
docker login -u cn-north-4@AK123 -p password123 swr.cn-north-4.myhuaweicloud.com

# 3. 标记镜像
docker tag personal-blog:v1.0 swr.cn-north-4.myhuaweicloud.com/personal-blog/blog-app:latest

# 4. 推送镜像
docker push swr.cn-north-4.myhuaweicloud.com/personal-blog/blog-app:latest
```

**服务器操作：**
```bash
# 1. 安装Docker（如果未安装）
curl -fsSL https://get.docker.com | sh

# 2. 创建目录
mkdir -p /opt/personal-blog && cd /opt/personal-blog

# 3. 创建docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  blog:
    image: swr.cn-north-4.myhuaweicloud.com/personal-blog/blog-app:latest
    container_name: personal-blog
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./data:/app/server/data
EOF

# 4. 登录华为云
docker login -u cn-north-4@AK123 -p password123 swr.cn-north-4.myhuaweicloud.com

# 5. 启动服务
docker-compose up -d

# 6. 查看状态
docker-compose ps
docker-compose logs -f
```

**访问：** http://服务器IP:3000

---

## 📚 相关文档

- 详细部署指南：`HUAWEI_CLOUD_DEPLOY.md`
- 项目说明：`README.md`
- 快速开始：`QUICK_START.md`

---

**祝您部署顺利！** 🚀

