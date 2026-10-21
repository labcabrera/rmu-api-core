#!/usr/bin/env bash
# Calls one read endpoint of every controller with a service-account token and fails on any non-2xx.
# Usage: scripts/smoke.sh [base-url]   (default http://localhost:3001; through the gateway: http://localhost/api/core)
# Needs RMU_IAM_CLIENT_ID and RMU_IAM_CLIENT_SECRET (read from .env when present) and Keycloak at RMU_IAM_URI.
set -euo pipefail

BASE_URL="${1:-http://localhost:3001}"
[ -f .env ] && { set -a; . ./.env; set +a; }
IAM_URI="${RMU_IAM_URI:-http://localhost/sso}"
REALM="${RMU_IAM_REALM:-rmu}"

TOKEN=$(curl -fsS "$IAM_URI/realms/$REALM/protocol/openid-connect/token" \
  -d grant_type=client_credentials -d "client_id=$RMU_IAM_CLIENT_ID" -d "client_secret=$RMU_IAM_CLIENT_SECRET" |
  node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).access_token))')

PATHS=(
  /v1/health
  /v1/armor-types
  /v1/character-sizes
  /v1/cultures
  /v1/effect-types
  /v1/enumerations
  /v1/enumeration-categories
  /v1/healing-tables
  /v1/maneuver-modifiers
  "/v1/maneuvers/percent?roll=50"
  "/v1/maneuvers/absolute?roll=50"
  "/v1/maneuvers/endurance?roll=50"
  /v1/maneuvers/absolute/tables
  /v1/professions
  /v1/races
  /v1/realms
  /v1/skill-categories
  /v1/skills
  /v1/traits
)

failed=0
call() {
  local status
  status=$(curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $TOKEN" "$@")
  printf '%s %s\n' "$status" "${*: -1}"
  [[ "$status" == 2* ]] || failed=1
}
for path in "${PATHS[@]}"; do
  call "$BASE_URL$path"
done
call -X POST -H 'Content-Type: application/json' -d '{"attackLevel":1,"targetLevel":1,"roll":50}' "$BASE_URL/v1/resistance-rolls"
exit $failed
