#!/bin/sh
# ==========================================
# SkillEngine - Health Check Script
# ==========================================

# Check if the server is responding
wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

echo "SkillEngine is healthy"
exit 0
