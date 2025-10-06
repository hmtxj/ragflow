.PHONY: help build up down logs shell test clean

# Default target
help:
	@echo "Available commands:"
	@echo "  build     - Build all Docker images"
	@echo "  up        - Start all services"
	@echo "  down      - Stop all services"
	@echo "  logs      - Show logs for all services"
	@echo "  shell     - Open shell in backend container"
	@echo "  test      - Run tests"
	@echo "  clean     - Clean up Docker resources"
	@echo "  migrate   - Run database migrations"
	@echo "  superuser - Create superuser"

# Build all images
build:
	docker-compose build

# Start all services
up:
	docker-compose up -d

# Stop all services
down:
	docker-compose down

# Show logs
logs:
	docker-compose logs -f

# Open shell in backend container
shell:
	docker-compose exec backend bash

# Run tests
test:
	docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Clean up Docker resources
clean:
	docker-compose down -v
	docker system prune -f

# Run database migrations
migrate:
	docker-compose exec backend alembic upgrade head

# Create superuser
superuser:
	docker-compose exec backend python scripts/create_superuser.py

# Development setup
dev-setup:
	cp .env.example .env
	@echo "Please edit .env file with your configuration"
	@echo "Then run: make build && make up"

# Production deployment
prod-deploy:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Backup database
backup-db:
	docker-compose exec postgres pg_dump -U postgres ai_image_platform > backup_$(shell date +%Y%m%d_%H%M%S).sql

# Restore database
restore-db:
	@echo "Usage: make restore-db BACKUP_FILE=backup_file.sql"
	docker-compose exec -T postgres psql -U postgres ai_image_platform < $(BACKUP_FILE)

# Update dependencies
update-deps:
	cd frontend && npm update
	cd backend && pip-compile requirements.in

# Security scan
security-scan:
	cd frontend && npm audit
	cd backend && safety check

# Performance test
perf-test:
	docker-compose exec backend locust -f tests/performance/locustfile.py