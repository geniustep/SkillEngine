#!/bin/bash
# ==========================================
# SkillEngine Deployment Script
# ==========================================

set -e

echo "🚀 SkillEngine Deployment Script"
echo "================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from template...${NC}"
    cp env.production.example .env
    echo -e "${RED}❌ Please edit .env file with your values and run again${NC}"
    exit 1
fi

# Create external networks if they don't exist
echo -e "${GREEN}📡 Creating external networks...${NC}"
docker network create mohcinae_web 2>/dev/null || true
docker network create mohcinae_backend 2>/dev/null || true

# Build images
echo -e "${GREEN}🔨 Building Docker images...${NC}"
docker-compose -f docker-compose.production.yml build

# Start services
echo -e "${GREEN}🚀 Starting services...${NC}"
docker-compose -f docker-compose.production.yml up -d

# Wait for database to be ready
echo -e "${GREEN}⏳ Waiting for database to be ready...${NC}"
sleep 10

# Run migrations
echo -e "${GREEN}📦 Running database migrations...${NC}"
docker exec skillengine-api npx prisma migrate deploy || {
    echo -e "${YELLOW}⚠️  Migration failed, trying db push...${NC}"
    docker exec skillengine-api npx prisma db push
}

# Show status
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
docker-compose -f docker-compose.production.yml ps

echo ""
echo -e "${GREEN}🌐 SkillEngine is now available at:${NC}"
echo "   Frontend: https://skill.geniura.com"
echo "   API: https://skill.geniura.com/api/v1"
echo "   API Docs: https://skill.geniura.com/api/docs"

