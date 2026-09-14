#!/usr/bin/env bash
# ==============================================================================
# Clean Artifacts Script - Removes test reports, logs, and trace artifacts
# ==============================================================================

set -e

echo "🧹 Cleaning test artifacts and logs..."
rm -rf test-results/
rm -rf reports/
rm -rf logs/*.log
rm -rf allure-results/
rm -rf allure-report/

echo "✨ Artifacts cleaned successfully."
