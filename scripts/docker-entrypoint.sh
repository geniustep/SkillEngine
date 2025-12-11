#!/bin/sh
# ==========================================
# SkillEngine - Docker Entrypoint Script
# ==========================================

set -e

echo "🚀 Starting SkillEngine..."
echo "   Environment: ${NODE_ENV:-production}"
echo "   App URL: ${NEXT_PUBLIC_APP_URL:-https://skill.geniura.com}"

# Wait for dependencies if needed
if [ -n "$WAIT_FOR_HOST" ]; then
    echo "⏳ Waiting for $WAIT_FOR_HOST..."
    while ! nc -z $WAIT_FOR_HOST $WAIT_FOR_PORT 2>/dev/null; do
        sleep 1
    done
    echo "✅ $WAIT_FOR_HOST is ready!"
fi

# Run database migrations or other setup if needed
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "📦 Running migrations..."
    # Add migration commands here if needed
fi

# Execute the main command
exec "$@"
