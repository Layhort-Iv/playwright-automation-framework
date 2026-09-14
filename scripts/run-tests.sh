#!/usr/bin/env bash
# ==============================================================================
# Enterprise Playwright Test Execution Script
# Usage: ./scripts/run-tests.sh [env] [tag] [project] [workers]
# Example: ./scripts/run-tests.sh qa "@smoke" chromium 4
# ==============================================================================

set -e

ENV=${1:-local}
TAG=${2:-"@smoke"}
PROJECT=${3:-""}
WORKERS=${4:-""}

echo "========================================================"
echo "🚀 Starting Enterprise Test Execution"
echo "   Environment: $ENV"
echo "   Tag:         $TAG"
echo "   Project:     ${PROJECT:-all}"
echo "   Workers:     ${WORKERS:-default}"
echo "========================================================"

CMD="cross-env TEST_ENV=$ENV npx playwright test --grep \"$TAG\""

if [ -n "$PROJECT" ]; then
  CMD="$CMD --project=$PROJECT"
fi

if [ -n "$WORKERS" ]; then
  CMD="$CMD --workers=$WORKERS"
fi

eval $CMD
