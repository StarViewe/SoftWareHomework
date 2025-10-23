#!/bin/bash

###############################################################################
# 个人博客系统 - 华为云一键部署脚本
# 使用方法：bash deploy.sh [选项]
# 选项：
#   build   - 构建并推送镜像
#   pull    - 拉取并启动服务
#   update  - 更新服务（拉取最新镜像并重启）
#   stop    - 停止服务
#   logs    - 查看日志
###############################################################################

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量（请根据实际情况修改）
REGISTRY="swr.cn-north-4.myhuaweicloud.com"
NAMESPACE="personal-blog"
IMAGE_NAME="blog-app"
VERSION="v1.0"

# 完整镜像名称
FULL_IMAGE="${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}"

# 函数：打印消息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 函数：检查Docker是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker未安装，请先安装Docker"
        exit 1
    fi
    print_success "Docker已安装：$(docker --version)"
}

# 函数：检查Docker Compose是否安装
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose未安装，请先安装Docker Compose"
        exit 1
    fi
    print_success "Docker Compose已安装：$(docker-compose --version)"
}

# 函数：构建镜像
build_image() {
    print_info "开始构建Docker镜像..."
    
    # 构建本地镜像
    docker build -t ${IMAGE_NAME}:${VERSION} .
    docker build -t ${IMAGE_NAME}:latest .
    
    print_success "镜像构建完成"
}

# 函数：标记镜像
tag_image() {
    print_info "标记镜像..."
    
    docker tag ${IMAGE_NAME}:${VERSION} ${FULL_IMAGE}:${VERSION}
    docker tag ${IMAGE_NAME}:latest ${FULL_IMAGE}:latest
    
    print_success "镜像标记完成"
}

# 函数：登录华为云镜像仓库
login_registry() {
    print_info "登录华为云镜像仓库..."
    
    # 提示用户输入凭证
    echo -e "${YELLOW}请输入华为云镜像仓库凭证：${NC}"
    read -p "用户名: " REGISTRY_USER
    read -sp "密码: " REGISTRY_PASSWORD
    echo
    
    docker login -u "${REGISTRY_USER}" -p "${REGISTRY_PASSWORD}" ${REGISTRY}
    
    if [ $? -eq 0 ]; then
        print_success "登录成功"
    else
        print_error "登录失败"
        exit 1
    fi
}

# 函数：推送镜像
push_image() {
    print_info "推送镜像到华为云..."
    
    docker push ${FULL_IMAGE}:${VERSION}
    docker push ${FULL_IMAGE}:latest
    
    print_success "镜像推送完成"
    print_info "镜像地址："
    echo "  - ${FULL_IMAGE}:${VERSION}"
    echo "  - ${FULL_IMAGE}:latest"
}

# 函数：拉取镜像
pull_image() {
    print_info "从华为云拉取镜像..."
    
    docker pull ${FULL_IMAGE}:latest
    
    print_success "镜像拉取完成"
}

# 函数：启动服务
start_service() {
    print_info "启动服务..."
    
    # 检查docker-compose.yml是否存在
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml文件不存在"
        exit 1
    fi
    
    # 启动服务
    docker-compose up -d
    
    print_success "服务启动成功"
    
    # 等待几秒让服务完全启动
    sleep 5
    
    # 显示服务状态
    docker-compose ps
}

# 函数：停止服务
stop_service() {
    print_info "停止服务..."
    
    docker-compose down
    
    print_success "服务已停止"
}

# 函数：查看日志
view_logs() {
    print_info "查看服务日志（按Ctrl+C退出）..."
    
    docker-compose logs -f
}

# 函数：更新服务
update_service() {
    print_info "更新服务..."
    
    # 拉取最新镜像
    pull_image
    
    # 重启服务
    docker-compose up -d
    
    print_success "服务更新完成"
    
    # 显示状态
    docker-compose ps
}

# 函数：构建并推送（完整流程）
build_and_push() {
    check_docker
    build_image
    tag_image
    login_registry
    push_image
}

# 函数：拉取并启动（服务器端）
pull_and_start() {
    check_docker
    check_docker_compose
    login_registry
    pull_image
    start_service
}

# 函数：显示帮助信息
show_help() {
    echo -e "${GREEN}个人博客系统 - 部署脚本${NC}"
    echo
    echo "使用方法："
    echo "  bash deploy.sh [选项]"
    echo
    echo "选项："
    echo "  build       - 构建并推送镜像到华为云（本地开发机使用）"
    echo "  pull        - 从华为云拉取镜像并启动服务（服务器使用）"
    echo "  update      - 更新服务（拉取最新镜像并重启）"
    echo "  stop        - 停止服务"
    echo "  logs        - 查看服务日志"
    echo "  help        - 显示帮助信息"
    echo
    echo "示例："
    echo "  # 本地构建并推送"
    echo "  bash deploy.sh build"
    echo
    echo "  # 服务器拉取并启动"
    echo "  bash deploy.sh pull"
    echo
    echo "  # 更新服务"
    echo "  bash deploy.sh update"
}

# 主函数
main() {
    # 显示脚本头
    echo -e "${GREEN}"
    echo "═══════════════════════════════════════════"
    echo "    个人博客系统 - 华为云部署脚本"
    echo "═══════════════════════════════════════════"
    echo -e "${NC}"
    
    # 检查参数
    if [ $# -eq 0 ]; then
        print_warning "未指定操作，显示帮助信息"
        echo
        show_help
        exit 0
    fi
    
    # 根据参数执行相应操作
    case "$1" in
        build)
            build_and_push
            ;;
        pull)
            pull_and_start
            ;;
        update)
            update_service
            ;;
        stop)
            stop_service
            ;;
        logs)
            view_logs
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "未知选项: $1"
            echo
            show_help
            exit 1
            ;;
    esac
    
    print_success "操作完成！"
}

# 执行主函数
main "$@"

