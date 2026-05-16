#!/usr/bin/env bash
# Deploy: rebuild images and recreate every service (even if already up).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

if command -v node >/dev/null 2>&1; then
  node "$ROOT/scripts/generate-manifest.js"
else
  echo "Warning: node not found — skipping manifest generation (Docker build will still generate it)."
fi

exec docker compose -f "$ROOT/docker-compose.yml" up -d --build --force-recreate
