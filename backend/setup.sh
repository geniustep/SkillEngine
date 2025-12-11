#!/bin/bash
set -e

echo "=== Step 1: Cleaning old node_modules ==="
rm -rf node_modules package-lock.json

echo "=== Step 2: Installing dependencies ==="
npm install

echo "=== Step 3: Generating Prisma Client ==="
npx prisma generate

echo "=== Step 4: Running database migrations ==="
npx prisma migrate deploy || npx prisma db push

echo "=== Setup Complete! ==="
echo "Run 'npm run start:dev' to start the server"

