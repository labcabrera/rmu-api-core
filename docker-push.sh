#!/bin/bash
set -euo pipefail

# Configurable variables
IMAGE=${IMAGE:-labcabrera/rmu-api-core}
TAG=${TAG:-latest}
PLATFORMS=${PLATFORMS:-linux/amd64,linux/arm64}

echo "Image: ${IMAGE}:${TAG}"
echo "Platforms: ${PLATFORMS}"

# If buildx is available, use it to create a multi-arch image and push manifest
if docker buildx version >/dev/null 2>&1; then
	# create a builder if it doesn't exist and use it
	if ! docker buildx inspect multi-builder >/dev/null 2>&1; then
		docker buildx create --name multi-builder --use >/dev/null
	else
		docker buildx use multi-builder >/dev/null || true
	fi

	docker buildx inspect --bootstrap >/dev/null

	echo "Building and pushing multi-arch image via buildx..."
	docker buildx build --platform "${PLATFORMS}" -t "${IMAGE}:${TAG}" --push .
	exit 0
else
	echo "docker buildx not available; falling back to classic build+push (single-arch)."
	docker build -t "${IMAGE}:${TAG}" .
	docker push "${IMAGE}:${TAG}"
	exit 0
fi
