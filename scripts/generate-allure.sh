#!/usr/bin/env bash
# ==============================================================================
# Generate & Serve Allure Report
# ==============================================================================

set -e

RESULTS_DIR=${1:-reports/allure-results}
REPORT_DIR=${2:-reports/allure-report}

echo "📊 Generating Allure Report from $RESULTS_DIR..."
npx allure generate "$RESULTS_DIR" --clean -o "$REPORT_DIR"

echo "✅ Allure Report generated at $REPORT_DIR"

if [ "$3" == "--open" ]; then
  echo "🌐 Opening Allure Report in browser..."
  npx allure open "$REPORT_DIR"
fi
