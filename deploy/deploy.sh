#!/usr/bin/env bash
set -euo pipefail

# Configuration
REMOTE_USER="achildrenmile"
REMOTE_HOST="host-node-01"
REMOTE_DIR="/home/achildrenmile/rednil"
REPO_URL="https://github.com/achildrenmile/rednil.git"
IMAGE_NAME="rednil-web"

echo "=== rednil.at Deploy ==="
CURRENT_BRANCH=$(git branch --show-current)
echo "Branch: ${CURRENT_BRANCH}"

# Step 1: Push to GitHub
echo ""
echo "--- Step 1: Push to GitHub ---"
git push origin "${CURRENT_BRANCH}"
GIT_SHA=$(git rev-parse --short HEAD)
echo "Pushed. SHA: ${GIT_SHA}"

# Step 2: Clone/pull + build on remote
echo ""
echo "--- Step 2: Remote build + deploy ---"
ssh "${REMOTE_USER}@${REMOTE_HOST}" bash <<EOF
  set -euo pipefail

  # Clone or pull
  if [ -d "${REMOTE_DIR}/.git" ]; then
    echo "Pulling latest..."
    cd "${REMOTE_DIR}"
    git fetch origin
    git reset --hard origin/${CURRENT_BRANCH}
  else
    echo "Cloning..."
    git clone "${REPO_URL}" "${REMOTE_DIR}"
    cd "${REMOTE_DIR}"
  fi

  # Build Docker image on remote
  echo "Building Docker image..."
  docker build -f deploy/Dockerfile -t "${IMAGE_NAME}:${GIT_SHA}" -t "${IMAGE_NAME}:latest" .

  # Stop old container if running
  docker compose -f deploy/docker-compose.yml down 2>/dev/null || true

  # Start new container
  docker compose -f deploy/docker-compose.yml up -d
  echo "Container started."
EOF

# Step 3: Healthcheck
echo ""
echo "--- Step 3: Healthcheck ---"
sleep 5
HEALTH=$(ssh "${REMOTE_USER}@${REMOTE_HOST}" \
  "docker inspect --format='{{.State.Health.Status}}' rednil-web 2>/dev/null || echo 'no-healthcheck'")

if [ "${HEALTH}" = "healthy" ] || [ "${HEALTH}" = "starting" ]; then
  echo "Healthcheck: ${HEALTH}"
  echo ""
  echo "=== Deploy complete ==="
  echo "Site: https://rednil.at"
else
  echo "WARNING: Healthcheck status: ${HEALTH}"
  echo "Checking logs..."
  ssh "${REMOTE_USER}@${REMOTE_HOST}" "docker logs --tail 20 rednil-web"
  echo ""
  echo "=== Deploy may have issues — check logs above ==="
  exit 1
fi
