#!/usr/bin/env bash
set -Eeuo pipefail

DOMAIN="${1:-}"
CONF_NAME="${2:-dreamshop}"
APP_PORT="${APP_PORT:-3001}"
BACKEND_PORT="${BACKEND_PORT:-5000}"
TEMPLATE_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/nginx.conf.example"
TARGET_PATH="/etc/nginx/sites-available/$CONF_NAME"
ENABLED_PATH="/etc/nginx/sites-enabled/$CONF_NAME"

if [[ -z "$DOMAIN" ]]; then
  echo "[ERROR] Domain is required. Usage: setup-nginx.sh <domain> [conf_name]"
  exit 1
fi

if [[ ! -f "$TEMPLATE_PATH" ]]; then
  echo "[ERROR] nginx template not found: $TEMPLATE_PATH"
  exit 1
fi

TMP_FILE="$(mktemp)"
cp "$TEMPLATE_PATH" "$TMP_FILE"

sed -i "s|yourdomain.com|$DOMAIN|g" "$TMP_FILE"
sed -i "s|www.yourdomain.com|www.$DOMAIN|g" "$TMP_FILE"
sed -i "s|localhost:3001|localhost:$APP_PORT|g" "$TMP_FILE"
sed -i "s|localhost:5000|localhost:$BACKEND_PORT|g" "$TMP_FILE"

sudo cp "$TMP_FILE" "$TARGET_PATH"
sudo ln -sfn "$TARGET_PATH" "$ENABLED_PATH"
sudo nginx -t
sudo systemctl reload nginx

rm -f "$TMP_FILE"
echo "[OK] nginx configured for $DOMAIN at $TARGET_PATH"
