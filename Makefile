# ==========================================
# SkillEngine Makefile
# ==========================================

.PHONY: help build up down logs status restart clean deploy k8s-deploy

# Default target
help:
	@echo "SkillEngine - Available Commands:"
	@echo ""
	@echo "Docker Compose (Development/Production):"
	@echo "  make build         - Build all Docker images"
	@echo "  make up            - Start all services"
	@echo "  make down          - Stop all services"
	@echo "  make logs          - View logs (use APP=api for specific)"
	@echo "  make status        - Show service status"
	@echo "  make restart       - Restart all services"
	@echo "  make clean         - Remove containers and volumes"
	@echo ""
	@echo "Backend Specific:"
	@echo "  make backend-build - Build backend image"
	@echo "  make backend-shell - Open shell in backend container"
	@echo "  make db-migrate    - Run database migrations"
	@echo "  make db-seed       - Seed database"
	@echo "  make db-studio     - Open Prisma Studio"
	@echo ""
	@echo "Kubernetes (Production):"
	@echo "  make k8s-deploy    - Deploy to Kubernetes"
	@echo "  make k8s-status    - Show Kubernetes status"
	@echo "  make k8s-logs      - View Kubernetes logs"
	@echo ""

# ==========================================
# Docker Compose Commands
# ==========================================

build:
	docker-compose -f docker-compose.production.yml build

up:
	docker-compose -f docker-compose.production.yml up -d

down:
	docker-compose -f docker-compose.production.yml down

logs:
ifdef APP
	docker-compose -f docker-compose.production.yml logs -f $(APP)
else
	docker-compose -f docker-compose.production.yml logs -f
endif

status:
	docker-compose -f docker-compose.production.yml ps

restart:
	docker-compose -f docker-compose.production.yml restart

clean:
	docker-compose -f docker-compose.production.yml down -v --remove-orphans

# ==========================================
# Backend Commands
# ==========================================

backend-build:
	docker build -t skillengine-api:latest ./backend

backend-shell:
	docker exec -it skillengine-api sh

db-migrate:
	docker exec skillengine-api npx prisma migrate deploy

db-seed:
	docker exec skillengine-api npx prisma db seed

db-studio:
	docker exec -it skillengine-api npx prisma studio --port 5555 --browser none

# ==========================================
# Kubernetes Commands
# ==========================================

k8s-deploy:
	@echo "Deploying SkillEngine to Kubernetes..."
	kubectl apply -k k8s/

k8s-status:
	kubectl get all -n skillengine

k8s-logs:
ifdef APP
	kubectl logs -f deployment/skillengine-$(APP) -n skillengine
else
	kubectl logs -f deployment/skillengine-api -n skillengine
endif

k8s-hpa:
	kubectl get hpa -n skillengine

k8s-delete:
	kubectl delete -k k8s/

# ==========================================
# Development Commands
# ==========================================

dev:
	docker-compose -f backend/docker-compose.yml up -d

dev-down:
	docker-compose -f backend/docker-compose.yml down

dev-logs:
	docker-compose -f backend/docker-compose.yml logs -f

# ==========================================
# Setup Commands
# ==========================================

setup:
	@echo "Setting up SkillEngine..."
	cp env.production.example .env
	cp k8s/secrets.yaml.template k8s/secrets.yaml
	@echo "Please edit .env and k8s/secrets.yaml with your values"

networks:
	@echo "Creating external networks..."
	docker network create mohcinae_web 2>/dev/null || true
	docker network create mohcinae_backend 2>/dev/null || true
