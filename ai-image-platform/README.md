# AI Image Platform - Enterprise Edition

🚀 **专业的企业级AI图像生成平台**

一个现代化、可扩展的AI图像生成解决方案，支持多种AI模型、风格标签系统、用户管理和企业级安全特性。

## ✨ 特性

### 🎨 核心功能
- **多模型支持**: 支持 OpenAI DALL-E、Stable Diffusion 等主流AI模型
- **丰富风格库**: 内置2000+艺术风格标签，涵盖韩漫、Pixiv、写实等各种风格
- **智能提示词**: AI辅助生成和优化提示词
- **多分辨率输出**: 支持普通、2K、4K等多种质量级别
- **批量生成**: 支持批量图片生成和处理

### 🏢 企业级特性
- **用户管理**: 完整的用户注册、认证、权限管理系统
- **多租户支持**: 支持不同用户计划（免费、专业、企业）
- **API配置管理**: 用户可自定义AI服务提供商配置
- **积分系统**: 灵活的积分消费和配额管理
- **审计日志**: 完整的操作日志和审计追踪

### 🔒 安全与合规
- **数据加密**: API密钥加密存储，传输数据TLS加密
- **访问控制**: 基于角色的权限控制（RBAC）
- **速率限制**: 多层级速率限制防护
- **内容过滤**: 智能内容审核和违禁词处理
- **GDPR合规**: 符合数据保护法规要求

### 📊 监控与运维
- **实时监控**: Prometheus + Grafana 监控仪表板
- **日志系统**: 结构化日志记录和分析
- **健康检查**: 多层级健康状态检查
- **性能指标**: 详细的性能和使用统计
- **告警系统**: 智能告警和通知

## 🏗️ 技术架构

### 前端技术栈
- **React 18** + **TypeScript** - 现代化前端框架
- **Vite** - 快速构建工具
- **TailwindCSS** - 实用优先的CSS框架
- **Zustand** - 轻量级状态管理
- **React Query** - 服务器状态管理
- **React Hook Form** - 表单处理
- **Framer Motion** - 动画库

### 后端技术栈
- **FastAPI** - 高性能异步Web框架
- **SQLAlchemy** + **Alembic** - ORM和数据库迁移
- **PostgreSQL** - 主数据库
- **Redis** - 缓存和会话存储
- **Celery** - 异步任务队列
- **Pydantic** - 数据验证
- **JWT** - 身份认证

### 基础设施
- **Docker** + **Docker Compose** - 容器化部署
- **Nginx** - 反向代理和负载均衡
- **Prometheus** + **Grafana** - 监控和可视化
- **Sentry** - 错误追踪
- **AWS S3** - 文件存储（可选）

## 🚀 快速开始

### 环境要求
- Docker & Docker Compose
- Node.js 18+ (开发环境)
- Python 3.11+ (开发环境)
- PostgreSQL 15+ (开发环境)
- Redis 7+ (开发环境)

### 1. 克隆项目
```bash
git clone https://github.com/your-org/ai-image-platform.git
cd ai-image-platform
```

### 2. 环境配置
```bash
# 复制环境配置文件
cp .env.example .env

# 编辑配置文件，设置数据库密码、API密钥等
vim .env
```

### 3. 使用Docker启动（推荐）
```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f backend
```

### 4. 访问应用
- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:8000
- **API文档**: http://localhost:8000/docs
- **监控面板**: http://localhost:3001 (admin/admin)
- **任务监控**: http://localhost:5555

### 5. 初始化数据
```bash
# 运行数据库迁移
docker-compose exec backend alembic upgrade head

# 创建超级用户（可选）
docker-compose exec backend python -m app.scripts.create_superuser
```

## 🛠️ 开发环境

### 后端开发
```bash
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或 venv\Scripts\activate  # Windows

# 安装依赖
pip install -r requirements.txt

# 启动开发服务器
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 前端开发
```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 数据库操作
```bash
# 创建迁移
alembic revision --autogenerate -m "描述"

# 应用迁移
alembic upgrade head

# 回滚迁移
alembic downgrade -1
```

## 📝 API文档

### 认证接口
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `POST /api/v1/auth/logout` - 用户登出
- `GET /api/v1/auth/me` - 获取当前用户信息

### 用户管理
- `GET /api/v1/users/profile` - 获取用户资料
- `PUT /api/v1/users/profile` - 更新用户资料
- `GET /api/v1/users/usage` - 获取使用统计

### 图片生成
- `POST /api/v1/generate` - 生成图片
- `GET /api/v1/generate/history` - 获取生成历史
- `GET /api/v1/generate/images/{id}` - 获取图片详情

### API配置管理
- `GET /api/v1/api-configs` - 获取API配置列表
- `POST /api/v1/api-configs` - 创建API配置
- `PUT /api/v1/api-configs/{id}` - 更新API配置
- `DELETE /api/v1/api-configs/{id}` - 删除API配置

完整API文档请访问：http://localhost:8000/docs

## 🔧 配置说明

### 环境变量
详细的环境变量配置请参考 `.env.example` 文件。

### 用户计划配置
```python
# 每日积分配额
FREE_CREDITS_PER_DAY = 10        # 免费用户
PRO_CREDITS_PER_DAY = 100        # 专业用户  
ENTERPRISE_CREDITS_PER_DAY = 1000 # 企业用户

# 积分消费
CREDIT_COST_NORMAL = 1  # 普通质量
CREDIT_COST_2K = 2      # 2K质量
CREDIT_COST_4K = 4      # 4K质量
```

### 速率限制配置
```python
RATE_LIMIT_PER_MINUTE = 60   # 每分钟请求限制
RATE_LIMIT_PER_HOUR = 1000   # 每小时请求限制
RATE_LIMIT_PER_DAY = 10000   # 每日请求限制
```

## 📊 监控与日志

### Prometheus指标
- `http_requests_total` - HTTP请求总数
- `http_request_duration_seconds` - 请求响应时间
- `active_users` - 活跃用户数
- `generation_requests_total` - 图片生成请求数
- `credits_consumed_total` - 积分消费总数

### 日志格式
应用使用结构化日志，支持JSON格式输出：
```json
{
  "timestamp": "2024-01-01T00:00:00Z",
  "level": "INFO",
  "logger": "app.services.user_service",
  "message": "User created",
  "user_id": "uuid",
  "email": "user@example.com"
}
```

## 🚢 部署指南

### 生产环境部署

1. **准备服务器**
   - 推荐配置：4核CPU，8GB内存，100GB SSD
   - 安装Docker和Docker Compose
   - 配置防火墙和SSL证书

2. **环境配置**
   ```bash
   # 设置生产环境变量
   export ENVIRONMENT=production
   export DEBUG=false
   
   # 生成安全的密钥
   export SECRET_KEY=$(openssl rand -hex 32)
   ```

3. **SSL证书配置**
   ```bash
   # 将SSL证书放置到指定目录
   mkdir -p deployment/nginx/ssl
   cp your-cert.pem deployment/nginx/ssl/cert.pem
   cp your-key.pem deployment/nginx/ssl/key.pem
   ```

4. **启动服务**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

### Kubernetes部署
项目包含Kubernetes部署配置，支持：
- 自动扩缩容
- 滚动更新
- 健康检查
- 配置管理

```bash
kubectl apply -f k8s/
```

## 🧪 测试

### 运行测试
```bash
# 后端测试
cd backend
pytest

# 前端测试
cd frontend
npm test

# 集成测试
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

### 测试覆盖率
```bash
# 后端覆盖率
pytest --cov=app --cov-report=html

# 前端覆盖率
npm run test:coverage
```

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范
- 后端：遵循PEP 8，使用black格式化
- 前端：使用ESLint和Prettier
- 提交信息：遵循Conventional Commits规范

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 支持

- 📧 邮件支持：support@ai-image-platform.com
- 💬 在线客服：https://chat.ai-image-platform.com
- 📖 文档中心：https://docs.ai-image-platform.com
- 🐛 问题反馈：https://github.com/your-org/ai-image-platform/issues

## 🗺️ 路线图

### v1.1 (计划中)
- [ ] 图片编辑功能
- [ ] 批量生成优化
- [ ] 移动端适配
- [ ] 多语言支持

### v1.2 (计划中)
- [ ] 视频生成支持
- [ ] 3D模型生成
- [ ] 高级风格迁移
- [ ] 企业SSO集成

### v2.0 (规划中)
- [ ] AI训练平台
- [ ] 模型市场
- [ ] 插件系统
- [ ] 白标解决方案

---

**AI Image Platform** - 让创意无限延伸 🚀