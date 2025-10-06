# 🚀 AI Image Platform - 部署指南

## 快速开始

### 1. 环境准备
```bash
# 克隆项目
git clone <repository-url>
cd ai-image-platform

# 运行快速设置脚本
./scripts/setup.sh

# 或者手动设置
cp .env.example .env
# 编辑 .env 文件配置你的环境
```

### 2. 使用 Docker Compose 启动
```bash
# 构建并启动所有服务
make build && make up

# 或者直接使用 docker-compose
docker-compose up --build -d

# 运行数据库迁移
make migrate

# 创建超级用户（可选）
make superuser
```

### 3. 访问应用
- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:8000
- **API文档**: http://localhost:8000/docs
- **监控面板**: http://localhost:3001 (admin/admin)
- **任务监控**: http://localhost:5555

## 生产环境部署

### 环境变量配置
```bash
# 必须配置的环境变量
export ENVIRONMENT=production
export DEBUG=false
export SECRET_KEY=$(openssl rand -hex 32)
export POSTGRES_PASSWORD=your-secure-password
export REDIS_PASSWORD=your-secure-redis-password

# 可选配置
export SENTRY_DSN=your-sentry-dsn
export AWS_ACCESS_KEY_ID=your-aws-key
export AWS_SECRET_ACCESS_KEY=your-aws-secret
export AWS_S3_BUCKET=your-s3-bucket
```

### 使用生产配置启动
```bash
# 使用生产配置文件
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 或者使用 Makefile
make prod-deploy
```

### SSL 证书配置
```bash
# 将SSL证书放置到指定目录
mkdir -p deployment/nginx/ssl
cp your-cert.pem deployment/nginx/ssl/cert.pem
cp your-key.pem deployment/nginx/ssl/key.pem
```

## Kubernetes 部署

### 1. 创建命名空间
```bash
kubectl create namespace ai-image-platform
```

### 2. 配置 Secrets
```bash
# 创建数据库密钥
kubectl create secret generic db-secret \
  --from-literal=url="postgresql+asyncpg://user:pass@host:5432/db" \
  -n ai-image-platform

# 创建应用密钥
kubectl create secret generic app-secret \
  --from-literal=secret-key="your-secret-key" \
  -n ai-image-platform
```

### 3. 部署应用
```bash
# 部署所有组件
kubectl apply -f k8s/ -n ai-image-platform

# 检查部署状态
kubectl get pods -n ai-image-platform
```

## 监控和日志

### Prometheus 监控
- 访问: http://localhost:9090
- 配置文件: `deployment/prometheus/prometheus.yml`

### Grafana 仪表板
- 访问: http://localhost:3001
- 默认账号: admin/admin
- 导入预配置的仪表板

### 日志查看
```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend

# 在 Kubernetes 中查看日志
kubectl logs -f deployment/ai-platform-backend -n ai-image-platform
```

## 备份和恢复

### 数据库备份
```bash
# 创建备份
make backup-db

# 恢复备份
make restore-db BACKUP_FILE=backup_20240101_120000.sql
```

### 文件备份
```bash
# 备份上传的文件
docker run --rm -v ai-image-platform_uploads:/data -v $(pwd):/backup alpine \
  tar czf /backup/uploads_backup.tar.gz /data

# 恢复文件
docker run --rm -v ai-image-platform_uploads:/data -v $(pwd):/backup alpine \
  tar xzf /backup/uploads_backup.tar.gz -C /
```

## 性能调优

### 数据库优化
```sql
-- 创建必要的索引
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_images_user_created ON generated_images(user_id, created_at);

-- 分析表统计信息
ANALYZE users;
ANALYZE generated_images;
```

### Redis 优化
```bash
# 配置 Redis 内存策略
redis-cli CONFIG SET maxmemory-policy allkeys-lru
redis-cli CONFIG SET maxmemory 1gb
```

### 应用优化
```bash
# 增加 worker 数量
docker-compose up --scale celery_worker=4

# 调整数据库连接池
export DATABASE_POOL_SIZE=20
export DATABASE_MAX_OVERFLOW=30
```

## 故障排除

### 常见问题

1. **数据库连接失败**
```bash
# 检查数据库状态
docker-compose exec postgres pg_isready -U postgres

# 查看数据库日志
docker-compose logs postgres
```

2. **Redis 连接失败**
```bash
# 检查 Redis 状态
docker-compose exec redis redis-cli ping

# 查看 Redis 日志
docker-compose logs redis
```

3. **图片生成失败**
```bash
# 检查 Celery worker 状态
docker-compose logs celery_worker

# 查看任务队列
docker-compose exec redis redis-cli llen celery
```

4. **前端无法访问后端**
```bash
# 检查网络连接
docker-compose exec frontend curl -f http://backend:8000/health

# 检查 CORS 配置
grep CORS_ORIGINS .env
```

### 健康检查
```bash
# 检查所有服务健康状态
curl http://localhost:8000/health
curl http://localhost:3000/health
curl http://localhost:9090/-/healthy
```

### 性能监控
```bash
# 查看系统资源使用
docker stats

# 查看数据库性能
docker-compose exec postgres psql -U postgres -c "
  SELECT query, mean_time, calls 
  FROM pg_stat_statements 
  ORDER BY mean_time DESC 
  LIMIT 10;"
```

## 安全配置

### 防火墙设置
```bash
# 只开放必要端口
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

### SSL/TLS 配置
```nginx
# Nginx SSL 配置
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
ssl_prefer_server_ciphers off;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### 定期安全更新
```bash
# 更新基础镜像
docker-compose pull
docker-compose up -d

# 扫描安全漏洞
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image ai-image-platform/backend:latest
```

## 扩展和升级

### 水平扩展
```bash
# 扩展后端服务
docker-compose up --scale backend=3

# 扩展 worker 服务
docker-compose up --scale celery_worker=5
```

### 版本升级
```bash
# 1. 备份数据
make backup-db

# 2. 拉取新版本
git pull origin main

# 3. 构建新镜像
docker-compose build

# 4. 运行数据库迁移
docker-compose exec backend alembic upgrade head

# 5. 重启服务
docker-compose up -d
```

### 零停机部署
```bash
# 使用蓝绿部署
docker-compose -f docker-compose.blue.yml up -d
# 切换流量
# 停止旧版本
docker-compose -f docker-compose.green.yml down
```