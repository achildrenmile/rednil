#!/usr/bin/env bash
set -euo pipefail

# Configuration
GHCR_REPO="ghcr.io/achildrenmile/rednil-web"
REMOTE_USER="achildrenmile"
REMOTE_HOST="host-node-01"
REMOTE_DIR="/home/achildrenmile/rednil"
COMPOSE_FILE="deploy/docker-compose.yml"

# Git tag for image versioning
GIT_SHA=$(git rev-parse --short HEAD)
IMAGE_TAG="${GHCR_REPO}:${GIT_SHA}"
IMAGE_LATEST="${GHCR_REPO}:latest"

echo "=== rednil.at Deploy ==="
echo "Git SHA: ${GIT_SHA}"
echo ""

# Step 1: Local sanity build
echo "--- Step 1: Local build check ---"
pnpm build
echo "Local build OK."
echo ""

# Step 2: Docker build (multi-stage, reproducible)
echo "--- Step 2: Docker build ---"
docker build -f deploy/Dockerfile -t "${IMAGE_TAG}" -t "${IMAGE_LATEST}" .
echo "Docker build OK: ${IMAGE_TAG}"
echo ""

# Step 3: Push to GHCR
echo "--- Step 3: Push to GHCR ---"
docker push "${IMAGE_TAG}"
docker push "${IMAGE_LATEST}"
echo "Pushed to GHCR."
echo ""

# Step 4: Deploy on remote
echo "--- Step 4: Remote deploy ---"
ssh "${REMOTE_USER}@${REMOTE_HOST}" bash -s <<REMOTE
  set -euo pipefail
  mkdir -p "${REMOTE_DIR}/deploy"
REMOTE

# Copy compose file to remote
scp "${COMPOSE_FILE}" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/deploy/docker-compose.yml"

ssh "${REMOTE_USER}@${REMOTE_HOST}" bash -s <<REMOTE
  set -euo pipefail
  cd "${REMOTE_DIR}"
  docker compose -f deploy/docker-compose.yml pull
  docker compose -f deploy/docker-compose.yml up -d
  echo "Container started."
REMOTE
echo ""

# Step 5: Healthcheck
echo "--- Step 5: Healthcheck ---"
sleep 3
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
