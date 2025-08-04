#!/bin/bash

set -e

DEFAULT_BASE_URL="http://localhost:3001/v1"
DEFAULT_CONTENT_TYPE="application/json"

KEYCLOAK_BASE_URL="${RMU_KEYCLOAK_BASE_URL}"
KEYCLOAK_REALM="${RMU_KEYCLOAK_REALM}"
KEYCLOAK_CLIENT_ID="${RMU_KEYCLOAK_CLIENT_ID}"
KEYCLOAK_CLIENT_SECRET="${RMU_KEYCLOAK_CLIENT_SECRET}"
KEYCLOAK_USERNAME="${RMU_KEYCLOAK_USER}"
KEYCLOAK_PASSWORD="${RMU_KEYCLOAK_PASSWORD}"

read_access_token() {
    echo "Fetching access token from Keycloak..."

    ACCESS_TOKEN=$(curl --silent --location "${KEYCLOAK_BASE_URL}/realms/rmu-local/protocol/openid-connect/token" \
        --header 'Content-Type: application/x-www-form-urlencoded' \
        --data-urlencode 'grant_type=password' \
        --data-urlencode "client_id=${KEYCLOAK_CLIENT_ID}" \
        --data-urlencode "client_secret=${KEYCLOAK_CLIENT_SECRET}" \
        --data-urlencode "username=${KEYCLOAK_USERNAME}" \
        --data-urlencode "password=${KEYCLOAK_PASSWORD}" \
        | jq -r '.access_token') \
    export ACCESS_TOKEN
}

send_file_to_service() {
    local filename="$1"
    local endpoint="$2"
    
    if [ -z "$filename" ] || [ -z "$endpoint" ]; then
        echo "Error: filename and endpoint are required"
        return 1
    fi
    
    if [ ! -f "$filename" ]; then
        echo "Error: File '$filename' not found"
        return 1
    fi

    local url="$DEFAULT_BASE_URL/$endpoint"

    curl -X POST \
         -H "Content-Type: $DEFAULT_CONTENT_TYPE" \
         -H "Accept: application/json" \
         -H "Authorization: Bearer $ACCESS_TOKEN" \
         -d @"$filename" \
         "$url" \
         -s --show-error \
         -w "\nHTTP Status: %{http_code}\nTotal Time: %{time_total}s\n" \
    
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo "Processed '$filename'"
    else
        echo "Failed '$filename'"
    fi
    
    return $exit_code
}



initialize_races() {
    echo "Initializing races..."   
    for race_file in races/*.json; do
        if [ -f "$race_file" ]; then
            send_file_to_service "$race_file" "races"
            echo ""
        fi
    done
    echo "Race data initialization completed"
}

initialize_realms() {
    echo "Initializing realms..."   
    for realm_file in realms/*.json; do
        if [ -f "$realm_file" ]; then
            send_file_to_service "$realm_file" "realms"
            echo ""
        fi
    done
    echo "Realm data initialization completed"
}

read_access_token
initialize_races
initialize_realms
