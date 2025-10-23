# 华为云容器镜像服务部署指南

本指南详细说明如何将个人博客系统部署到华为云，使用华为云容器镜像服务（SWR）和云服务器（ECS）。

---

## 📋 前置准备

### 1. 华为云账号
- 已注册华为云账号
- 已实名认证
- 有可用的云服务器（ECS）或准备购买

### 2. 本地环境
- 已安装Docker（版本 >= 20.10）
- 已安装Docker Compose（版本 >= 2.0）
- 已安装Git

### 3. 项目准备
- 确保项目代码完整
- 已测试本地运行正常

---

## 🚀 部署步骤

### 第一步：安装和配置Docker

#### Windows系统
```powershell
# 下载并安装Docker Desktop for Windows
# 访问：https://www.docker.com/products/docker-desktop

# 验证安装
docker --version
docker-compose --version
```

#### Linux系统（推荐用于服务器）
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y docker.io docker-compose

# 启动Docker服务
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
docker --version
docker-compose --version

# 添加当前用户到docker组（避免每次使用sudo）
sudo usermod -aG docker $USER
# 重新登录后生效
```

---

### 第二步：华为云容器镜像服务配置

#### 1. 创建组织和镜像仓库

1. 登录[华为云控制台](https://console.huaweicloud.com)
2. 搜索并进入 **容器镜像服务 SWR**
3. 选择区域（如：华北-北京四）
4. 创建组织：
   - 点击"创建组织"
   - 组织名称：`personal-blog`（可自定义）
   - 点击"确定"
5. 创建镜像仓库：
   - 点击"创建镜像仓库"
   - 仓库名称：`blog-app`
   - 类型：私有
   - 点击"确定"

#### 2. 获取登录指令

在SWR控制台右上角点击"客户端上传下载指令"，会看到类似：

```bash
# 登录指令示例
docker login -u cn-north-4@ABCDEFGHIJK -p 1234567890abcdef swr.cn-north-4.myhuaweicloud.com
```

记录以下信息：
- **镜像仓库地址：** `swr.cn-north-4.myhuaweicloud.com`
- **组织名称：** `personal-blog`
- **用户名：** `cn-north-4@ABCDEFGHIJK`
- **密码：** `1234567890abcdef`

---

### 第三步：构建和推送Docker镜像

#### 1. 在项目根目录构建镜像

```bash
# 进入项目目录
cd homework

# 构建Docker镜像
docker build -t personal-blog:v1.0 .

# 查看构建的镜像
docker images | grep personal-blog
```

#### 2. 登录华为云镜像仓库

```bash
# 使用华为云提供的登录指令
docker login -u <你的用户名> -p <你的密码> swr.cn-north-4.myhuaweicloud.com

# 示例：
# docker login -u cn-north-4@ABCDEFGHIJK -p 1234567890abcdef swr.cn-north-4.myhuaweicloud.com
```

#### 3. 标记镜像

```bash
# 格式：镜像仓库地址/组织名称/镜像名称:标签
docker tag personal-blog:v1.0 swr.cn-north-4.myhuaweicloud.com/personal-blog/blog-app:v1.0

# 也标记为latest
docker tag personal-blog:v1.0 swr.cn-north-4.myhuaweicloud.com/personal-blog/blog-app:latest
```

#### 4. 推送镜像到华为云

```bash
# 推送v1.0标签
docker push swr.cn-north-4.myhuaweicloud.com/personal-blog/blog-app:v1.0

# 推送latest标签
docker push swr.cn-north-4.myhuaweicloud.com/personal-blog/blog-app:latest
```

推送成功后，在华为云SWR控制台可以看到镜像。

---

### 第四步：在云服务器上部署

#### 1. 准备云服务器

**购买ECS云服务器（如果还没有）：**
- 规格：2核4G（最低配置）
- 操作系统：Ubuntu 20.04 / CentOS 7+
- 带宽：按需选择
- 安全组：开放80、443、3000端口

**连接到服务器：**
```bash
# 使用SSH连接
ssh root@<你的服务器IP>
```

#### 2. 服务器环境配置

```bash
# 更新系统
sudo apt-get update

# 安装Docker
curl -fsSL https://get.docker.com | sh

# 启动Docker
sudo systemctl start docker
sudo systemctl enable docker

# 安装Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

#### 3. 登录华为云镜像仓库

```bash
# 在服务器上登录
docker login -u <你的用户名> -p <你的密码> swr.cn-north-4.myhuaweicloud.com
```

#### 4. 创建部署目录

```bash
# 创建应用目录
mkdir -p /opt/personal-blog
cd /opt/personal-blog

# 创建数据和日志目录
mkdir -p data logs
```

#### 5. 创建docker-compose.yml

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
      - JWT_SECRET=your-super-secret-jwt-key-change-this
    volumes:
      - ./data:/app/server/data
      - ./logs:/app/logs
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
EOF
```

#### 6. 启动应用

```bash
# 拉取最新镜像
docker-compose pull

# 启动容器
docker-compose up -d

# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

---

### 第五步：配置Nginx反向代理（可选但推荐）

#### 1. 安装Nginx

```bash
sudo apt-get install -y nginx
```

#### 2. 配置Nginx

```bash
# 创建配置文件
sudo nano /etc/nginx/sites-available/blog
```

粘贴以下配置（使用项目中的nginx.conf内容）：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 修改为你的域名或服务器IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 3. 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

### 第六步：配置防火墙和安全组

#### 1. 华为云安全组配置

在华为云ECS控制台：
1. 进入实例详情
2. 点击"安全组"标签
3. 配置入方向规则：

| 协议 | 端口 | 源地址 | 说明 |
|------|------|--------|------|
| TCP | 80 | 0.0.0.0/0 | HTTP |
| TCP | 443 | 0.0.0.0/0 | HTTPS |
| TCP | 22 | 你的IP | SSH |
| TCP | 3000 | 127.0.0.1/32 | API（如果用Nginx则不需要公开） |

#### 2. 服务器防火墙配置（Ubuntu）

```bash
# 安装UFW
sudo apt-get install -y ufw

# 配置规则
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# 启用防火墙
sudo ufw enable

# 查看状态
sudo ufw status
```

---

## 🔄 更新部署流程

当代码更新后，按以下流程更新：

### 本地操作

```bash
# 1. 构建新镜像（版本号递增）
docker build -t personal-blog:v1.1 .

# 2. 标记镜像
docker tag personal-blog:v1.1 swr.cn-north-4.myhuaweicloud.com/personal-blog/blog-app:v1.1
docker tag personal-blog:v1.1 swr.cn-north-4.myhuaweicloud.com/personal-blog/blog-app:latest

# 3. 推送镜像
docker push swr.cn-north-4.myhuaweicloud.com/personal-blog/blog-app:v1.1
docker push swr.cn-north-4.myhuaweicloud.com/personal-blog/blog-app:latest
```

### 服务器操作

```bash
# 进入部署目录
cd /opt/personal-blog

# 拉取最新镜像
docker-compose pull

# 重启服务（保留数据）
docker-compose up -d

# 查看日志确认启动成功
docker-compose logs -f
```

---

## 📊 监控和管理

### 查看运行状态

```bash
# 查看容器状态
docker-compose ps

# 查看容器日志
docker-compose logs -f blog

# 查看容器资源使用
docker stats personal-blog
```

### 数据备份

```bash
# 备份数据目录
cd /opt/personal-blog
tar -czf backup-$(date +%Y%m%d).tar.gz data/

# 下载到本地（在本地执行）
scp root@<服务器IP>:/opt/personal-blog/backup-*.tar.gz ./
```

### 服务管理命令

```bash
# 停止服务
docker-compose stop

# 启动服务
docker-compose start

# 重启服务
docker-compose restart

# 查看日志
docker-compose logs -f

# 进入容器
docker exec -it personal-blog sh

# 清理未使用的镜像
docker system prune -a
```

---

## 🔧 常见问题

### 1. 镜像推送失败

**问题：** `unauthorized: authentication required`

**解决：**
```bash
# 重新登录
docker logout swr.cn-north-4.myhuaweicloud.com
docker login -u <用户名> -p <密码> swr.cn-north-4.myhuaweicloud.com
```

### 2. 容器无法启动

**问题：** 容器状态显示Exited

**解决：**
```bash
# 查看详细日志
docker-compose logs blog

# 检查端口占用
netstat -tlnp | grep 3000

# 重新创建容器
docker-compose down
docker-compose up -d
```

### 3. 无法访问服务

**问题：** 浏览器无法访问

**解决：**
```bash
# 检查容器是否运行
docker ps | grep blog

# 检查端口监听
netstat -tlnp | grep 3000

# 检查防火墙
sudo ufw status

# 检查华为云安全组配置
```

### 4. 数据丢失

**问题：** 容器重启后数据丢失

**解决：**
- 确保docker-compose.yml中配置了volumes
- 检查宿主机data目录权限
- 定期备份data目录

---

## 🌐 配置域名（可选）

### 1. 域名解析

在域名服务商处添加A记录：
- 主机记录：`blog` 或 `@`
- 记录类型：`A`
- 记录值：`<你的服务器IP>`
- TTL：`600`

### 2. 配置SSL证书（HTTPS）

```bash
# 安装Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

---

## 📈 性能优化建议

### 1. 服务器配置建议

- **最低配置：** 2核4G（支持100并发）
- **推荐配置：** 4核8G（支持500并发）
- **高性能配置：** 8核16G（支持1000+并发）

### 2. 优化措施

```bash
# 限制容器资源
# 修改docker-compose.yml
services:
  blog:
    # ... 其他配置
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

---

## 🔐 安全建议

1. **修改默认密码**
   - 修改JWT_SECRET环境变量
   - 修改admin账号密码

2. **配置HTTPS**
   - 使用Let's Encrypt免费证书
   - 强制HTTP跳转HTTPS

3. **定期更新**
   - 定期更新系统和Docker
   - 定期更新应用镜像

4. **访问控制**
   - 限制SSH访问IP
   - 使用密钥登录而非密码

---

## 📝 完整部署脚本

为了简化部署，我们提供了一键部署脚本，请查看项目中的 `deploy.sh` 文件。

---

## 🎉 部署完成

部署完成后：
1. 浏览器访问 `http://<服务器IP>` 或 `http://your-domain.com`
2. 使用默认账号登录管理后台
3. 开始使用您的博客系统！

---

## 📞 技术支持

遇到问题？
1. 查看项目README.md
2. 查看容器日志：`docker-compose logs -f`
3. 检查服务器资源：`htop` 或 `docker stats`

---

**祝您部署顺利！** 🚀

