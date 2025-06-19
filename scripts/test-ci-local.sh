#!/bin/bash
set -e

echo "🔍 Running CI checks locally..."
echo "================================"

echo ""
echo "📦 Installing dependencies..."
npm ci

echo ""
echo "🔧 Running type check..."
npm run type-check

echo ""
echo "🔍 Running linter..."
npm run lint

echo ""
echo "🧪 Running tests..."
npm test -- --ci --coverage --passWithNoTests

echo ""
echo "🏗️ Building application..."
SKIP_ENV_VALIDATION=true npm run build

echo ""
echo "================================"
echo "✅ All CI checks passed!"