#!/usr/bin/env bash
set -Eeuo pipefail

# Dreamshop production deploy script
# Usage:
#   ./deploy-prod.sh
# Optional env overrides:
#   APP_NAME=dreamshop DEPLOY_BRANCH=main ./deploy-prod.sh

APP_NAME="${APP_NAME:-dreamshop}"
APP_DIR="${APP_DIR:-$(pwd)}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-}"
ENV_FILE="${ENV_FILE:-$APP_DIR/.env}"
NGINX_DOMAIN="${NGINX_DOMAIN:-}"
NGINX_CONF_NAME="${NGINX_CONF_NAME:-dreamshop}"

log() { printf "\n[%s] %s\n" "$(date '+%F %T')" "$*"; }
warn() { printf "\n[WARN] %s\n" "$*" >&2; }
die() { printf "\n[ERROR] %s\n" "$*" >&2; exit 1; }

command -v git >/dev/null 2>&1 || die "git is not installed"
command -v npm >/dev/null 2>&1 || die "npm is not installed"
command -v pm2 >/dev/null 2>&1 || die "pm2 is not installed"

cd "$APP_DIR"

[[ -d .git ]] || die "Current directory is not a git repository: $APP_DIR"

if [[ ! -f "$ENV_FILE" ]]; then
  die ".env file not found at $ENV_FILE"
fi

# Backup env before deploy
ENV_BACKUP="$APP_DIR/.env.backup.$(date +%F-%H%M%S)"
cp "$ENV_FILE" "$ENV_BACKUP"
log "Backed up .env to $ENV_BACKUP"

# Determine target branch
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
if [[ -z "$DEPLOY_BRANCH" ]]; then
  if [[ "$CURRENT_BRANCH" == "HEAD" || -z "$CURRENT_BRANCH" ]]; then
    DEPLOY_BRANCH="main"
  else
    DEPLOY_BRANCH="$CURRENT_BRANCH"
  fi
fi

log "Deploying branch: $DEPLOY_BRANCH"
git fetch --all --prune
git checkout "$DEPLOY_BRANCH"
git reset --hard "origin/$DEPLOY_BRANCH"

log "Installing dependencies"
if ! npm ci; then
  warn "npm ci failed (lockfile mismatch). Falling back to npm install"
  npm install
fi

if command -v docker >/dev/null 2>&1; then
  if [[ -f "$APP_DIR/docker-compose.yml" ]]; then
    log "Starting project database container (postgres)"
    docker compose up -d postgres || warn "Could not start postgres container automatically"
  fi
fi

log "Building full project (frontend + backend)"
npm run build:all

# Read PORT from .env (fallback to 3001)
PORT="$(grep -E '^PORT=' "$ENV_FILE" | tail -n1 | cut -d '=' -f2- | tr -d '"' | tr -d "'" | xargs || true)"
PORT="${PORT:-3001}"

log "Restarting PM2 app '$APP_NAME' on port $PORT (frontend) + backend on BACKEND_PORT"
APP_NAME="$APP_NAME" PORT="$PORT" NODE_ENV=production npm run pm2:start

log "Waiting for app to become healthy"
for i in {1..20}; do
  if curl -fsS "http://127.0.0.1:$PORT" >/dev/null 2>&1; then
    log "Health check passed on http://127.0.0.1:$PORT"
    break
  fi
  sleep 1
  if [[ "$i" -eq 20 ]]; then
    warn "Health check did not pass within timeout"
  fi
done

log "PM2 status"
pm2 status

if [[ -n "$NGINX_DOMAIN" ]]; then
  log "Applying nginx config for domain: $NGINX_DOMAIN"
  bash "$APP_DIR/scripts/setup-nginx.sh" "$NGINX_DOMAIN" "$NGINX_CONF_NAME"
fi

log "Listening ports (3001/5000/5001/5432/5433)"
ss -ltnp | grep -E ':3001|:5000|:5001|:5432|:5433' || true

log "Recent logs for $APP_NAME"
pm2 logs "$APP_NAME" --lines 40 --nostream || true

log "Deploy finished"
