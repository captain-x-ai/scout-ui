#!/bin/sh
set -eu

API_URL="${VITE_API_BASE_URL:-}"

cat > /usr/share/nginx/html/env-config.js <<EOF
window.__ENV__ = {
  VITE_API_BASE_URL: "${API_URL}",
};
EOF

exec nginx -g "daemon off;"
