# AI Image Platform - 系统架构文档

## 🏗️ 整体架构

AI Image Platform 采用现代化的微服务架构，具备高可用性、可扩展性和企业级安全特性。

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │     CDN         │    │   Monitoring    │
│    (Nginx)      │    │   (CloudFlare)  │    │ (Prometheus)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   React SPA     │  │   Admin Panel   │  │   Mobile App    │ │
│  │  (TypeScript)   │  │  (TypeScript)   │  │  (React Native) │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway                             │
│                        (FastAPI)                                │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  User Service   │  │  Image Service  │  │  AI Service     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Auth Service   │  │ Payment Service │  │ Notification    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Data Layer                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   PostgreSQL    │  │      Redis      │  │   File Storage  │ │
│  │   (Primary DB)  │  │    (Cache)      │  │     (S3/Local)  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │    OpenAI       │  │  Stability AI   │  │   Midjourney    │ │
│  │   (DALL-E)      │  │ (Stable Diff.)  │  │    (API)        │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 技术栈详解

### 前端技术栈
- **React 18**: 现代化前端框架，支持并发特性
- **TypeScript**: 类型安全，提高代码质量
- **Vite**: 快速构建工具，热更新
- **TailwindCSS**: 实用优先的CSS框架
- **Zustand**: 轻量级状态管理
- **React Query**: 服务器状态管理和缓存
- **React Hook Form**: 高性能表单处理
- **Framer Motion**: 流畅动画效果

### 后端技术栈
- **FastAPI**: 高性能异步Web框架
- **SQLAlchemy**: ORM框架，支持异步操作
- **Alembic**: 数据库迁移工具
- **Pydantic**: 数据验证和序列化
- **Celery**: 分布式任务队列
- **JWT**: 无状态身份认证
- **Structlog**: 结构化日志记录

### 数据存储
- **PostgreSQL 15**: 主数据库，支持JSON和全文搜索
- **Redis 7**: 缓存、会话存储、任务队列
- **AWS S3**: 文件存储（可选本地存储）

### 基础设施
- **Docker**: 容器化部署
- **Nginx**: 反向代理和负载均衡
- **Prometheus**: 监控指标收集
- **Grafana**: 监控数据可视化
- **Sentry**: 错误追踪和性能监控

## 📊 数据模型设计

### 核心实体关系图
```
┌─────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    User     │────▶│   ApiConfig     │     │   StyleTag      │
│             │     │                 │     │                 │
│ - id        │     │ - id            │     │ - id            │
│ - email     │     │ - name          │     │ - name          │
│ - username  │     │ - type          │     │ - category      │
│ - plan      │     │ - provider      │     │ - type          │
│ - credits   │     │ - base_url      │     │ - popularity    │
└─────────────┘     │ - api_key       │     └─────────────────┘
       │            │ - model         │              │
       │            └─────────────────┘              │
       │                     │                       │
       ▼                     ▼                       ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│GeneratedImage   │   │GenerationHistory│   │   ImageLikes    │
│                 │   │                 │   │                 │
│ - id            │   │ - id            │   │ - user_id       │
│ - url           │   │ - status        │   │ - image_id      │
│ - prompt        │   │ - error_msg     │   │ - created_at    │
│ - style_tags    │   │ - credits_used  │   └─────────────────┘
│ - ratio         │   │ - created_at    │
│ - quality       │   └─────────────────┘
│ - is_public     │
│ - likes         │
│ - downloads     │
└─────────────────┘
```

### 数据库索引策略
```sql
-- 用户表索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_plan ON users(plan);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 图片表索引
CREATE INDEX idx_images_user_id ON generated_images(user_id);
CREATE INDEX idx_images_created_at ON generated_images(created_at);
CREATE INDEX idx_images_is_public ON generated_images(is_public);
CREATE INDEX idx_images_likes ON generated_images(likes);

-- 风格标签索引
CREATE INDEX idx_style_tags_category ON style_tags(category);
CREATE INDEX idx_style_tags_popularity ON style_tags(popularity);
CREATE INDEX idx_style_tags_name_gin ON style_tags USING gin(name gin_trgm_ops);
```

## 🔐 安全架构

### 认证与授权
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │    │   API Gateway   │    │  Auth Service   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. Login Request      │                       │
         ├──────────────────────▶│ 2. Validate Creds    │
         │                       ├──────────────────────▶│
         │                       │ 3. JWT Token          │
         │ 4. JWT Token          │◀──────────────────────┤
         │◀──────────────────────┤                       │
         │                       │                       │
         │ 5. API Request + JWT  │                       │
         ├──────────────────────▶│ 6. Verify JWT         │
         │                       ├──────────────────────▶│
         │                       │ 7. User Info          │
         │ 8. API Response       │◀──────────────────────┤
         │◀──────────────────────┤                       │
```

### 数据加密
- **传输加密**: 全站HTTPS，TLS 1.3
- **存储加密**: API密钥AES-256加密存储
- **密码加密**: bcrypt哈希，盐值随机生成
- **JWT签名**: HMAC-SHA256算法

### 访问控制
```python
# 基于角色的权限控制
class Permission(Enum):
    READ_USER = "read:user"
    WRITE_USER = "write:user"
    READ_ADMIN = "read:admin"
    WRITE_ADMIN = "write:admin"
    GENERATE_IMAGE = "generate:image"
    MANAGE_API_CONFIG = "manage:api_config"

class Role(Enum):
    FREE_USER = [Permission.READ_USER, Permission.GENERATE_IMAGE]
    PRO_USER = [Permission.READ_USER, Permission.WRITE_USER, Permission.GENERATE_IMAGE, Permission.MANAGE_API_CONFIG]
    ENTERPRISE_USER = [Permission.READ_USER, Permission.WRITE_USER, Permission.GENERATE_IMAGE, Permission.MANAGE_API_CONFIG]
    ADMIN = [Permission.READ_ADMIN, Permission.WRITE_ADMIN, *Permission]
```

## 🚀 性能优化

### 缓存策略
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Browser       │    │   CDN Cache     │    │  Redis Cache    │
│   Cache         │    │   (Static)      │    │  (Dynamic)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. Request            │                       │
         ├──────────────────────▶│ 2. Cache Miss         │
         │                       ├──────────────────────▶│
         │                       │ 3. Cache Hit/Miss     │
         │                       │◀──────────────────────┤
         │ 4. Response + Cache   │                       │
         │◀──────────────────────┤                       │
```

### 数据库优化
- **连接池**: SQLAlchemy连接池，最大20个连接
- **查询优化**: 索引优化，避免N+1查询
- **分页查询**: 游标分页，提高大数据集性能
- **读写分离**: 主从复制，读写分离

### 异步处理
```python
# 图片生成异步任务
@celery_app.task(bind=True, max_retries=3)
def generate_image_task(self, generation_request):
    try:
        # 调用AI服务生成图片
        image_url = ai_service.generate_image(generation_request)
        
        # 保存到数据库
        save_generated_image(image_url, generation_request)
        
        # 发送通知
        notify_user(generation_request.user_id, "图片生成完成")
        
    except Exception as exc:
        # 重试机制
        raise self.retry(exc=exc, countdown=60)
```

## 📊 监控与可观测性

### 监控指标
```yaml
# Prometheus监控指标
metrics:
  - name: http_requests_total
    type: counter
    labels: [method, endpoint, status_code]
  
  - name: http_request_duration_seconds
    type: histogram
    labels: [method, endpoint]
  
  - name: active_users_total
    type: gauge
    
  - name: generation_requests_total
    type: counter
    labels: [model, quality, status]
  
  - name: credits_consumed_total
    type: counter
    labels: [user_plan]
  
  - name: database_connections_active
    type: gauge
  
  - name: redis_memory_usage_bytes
    type: gauge
```

### 日志结构
```json
{
  "timestamp": "2024-01-01T00:00:00Z",
  "level": "INFO",
  "logger": "app.services.generation_service",
  "message": "Image generation started",
  "trace_id": "abc123",
  "span_id": "def456",
  "user_id": "user-uuid",
  "request_id": "req-uuid",
  "generation_params": {
    "model": "dall-e-3",
    "quality": "2K",
    "ratio": "1:1"
  }
}
```

### 告警规则
```yaml
# Prometheus告警规则
groups:
  - name: api_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status_code=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"
      
      - alert: DatabaseConnectionsHigh
        expr: database_connections_active > 15
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Database connections near limit"
```

## 🔄 部署架构

### 容器化部署
```yaml
# Docker Compose生产配置
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    replicas: 2
    
  backend:
    image: ai-platform/backend:latest
    replicas: 3
    resources:
      limits:
        memory: 1G
        cpus: 0.5
    
  worker:
    image: ai-platform/backend:latest
    replicas: 2
    command: celery worker
    
  postgres:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
```

### Kubernetes部署
```yaml
# Kubernetes部署配置
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-platform-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ai-platform-backend
  template:
    metadata:
      labels:
        app: ai-platform-backend
    spec:
      containers:
      - name: backend
        image: ai-platform/backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
```

## 🔧 扩展性设计

### 水平扩展
- **无状态设计**: API服务无状态，支持水平扩展
- **负载均衡**: Nginx负载均衡，支持多实例
- **数据库分片**: 按用户ID分片，支持数据库扩展
- **缓存分布**: Redis集群，支持缓存扩展

### 垂直扩展
- **资源配置**: Docker资源限制，K8s资源配额
- **性能调优**: 数据库连接池，异步处理优化
- **存储优化**: 文件压缩，CDN加速

这个架构设计确保了系统的高可用性、可扩展性和安全性，能够支持企业级的生产环境需求。