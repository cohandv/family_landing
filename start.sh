#!/usr/bin/env bash
# Deploy: rebuild images and recreate every service (even if already up).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

exec docker compose -f "$ROOT/docker-compose.yml" up -d --build --force-recreate
