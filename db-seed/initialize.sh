#!/bin/bash

set -e

DEFAULT_BASE_URL="http://localhost:3001/v1"
DEFAULT_CONTENT_TYPE="application/json"

KEYCLOAK_TOKEN_URI="${RMU_IAM_TOKEN_URI}"
KEYCLOAK_REALM="${RMU_IAM_REALM}"
KEYCLOAK_CLIENT_ID="${RMU_IAM_CLIENT_ID}"
KEYCLOAK_CLIENT_SECRET="${RMU_IAM_CLIENT_SECRET}"
KEYCLOAK_USERNAME="${RMU_IAM_USERNAME}"
KEYCLOAK_PASSWORD="${RMU_IAM_PASSWORD}"

#TODO local values for testing
KEYCLOAK_TOKEN_URI=http://localhost:8090/realms/rmu-local/protocol/openid-connect/token
KEYCLOAK_CLIENT_ID=rmu-client
KEYCLOAK_CLIENT_SECRET=1tUzPc24SYJMPpX37g2eymEoS9C3Ttzw

read_access_token() {
    echo "Fetching access token from Keycloak..."
    ACCESS_TOKEN=$(curl --silent --location "${KEYCLOAK_TOKEN_URI}" \
        --header 'Content-Type: application/x-www-form-urlencoded' \
        --data-urlencode 'grant_type=client_credentials' \
        --data-urlencode "client_id=${KEYCLOAK_CLIENT_ID}" \
        --data-urlencode "client_secret=${KEYCLOAK_CLIENT_SECRET}" \
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

initialize_skill_categories() {
    echo "Initializing skill categories..."   
    for skill_category_file in skill-categories/*.json; do
        if [ -f "$skill_category_file" ]; then
            # If the file contains a JSON array, post each element separately
            if jq -e 'if type=="array" then true else false end' "$skill_category_file" >/dev/null 2>&1; then
                count=$(jq 'length' "$skill_category_file")
                echo "Found array with $count entries in '$skill_category_file'"
                jq -c '.[]' "$skill_category_file" | while IFS= read -r item; do
                    curl -X POST \
                         -H "Content-Type: $DEFAULT_CONTENT_TYPE" \
                         -H "Accept: application/json" \
                         -H "Authorization: Bearer $ACCESS_TOKEN" \
                         -d "$item" \
                         "$DEFAULT_BASE_URL/skill-categories" \
                         -s --show-error \
                         -w "\nHTTP Status: %{http_code}\nTotal Time: %{time_total}s\n"

                    rc=$?
                    if [ $rc -eq 0 ]; then
                        echo "Processed item"
                    else
                        echo "Failed item (exit $rc)"
                    fi
                    echo ""
                done
            else
                send_file_to_service "$skill_category_file" "skill-categories"
                echo ""
            fi
        fi
    done
    echo "Skill category data initialization completed"
}

initialize_skills() {
    echo "Initializing skills..."   
    for skill_file in skills/*.json; do
        if [ -f "$skill_file" ]; then
            # If the file contains a JSON array, post each element separately
            if jq -e 'if type=="array" then true else false end' "$skill_file" >/dev/null 2>&1; then
                count=$(jq 'length' "$skill_file")
                echo "Found array with $count entries in '$skill_file'"
                jq -c '.[]' "$skill_file" | while IFS= read -r item; do
                    curl -X POST \
                         -H "Content-Type: $DEFAULT_CONTENT_TYPE" \
                         -H "Accept: application/json" \
                         -H "Authorization: Bearer $ACCESS_TOKEN" \
                         -d "$item" \
                         "$DEFAULT_BASE_URL/skills" \
                         -s --show-error \
                         -w "\nHTTP Status: %{http_code}\nTotal Time: %{time_total}s\n"

                    rc=$?
                    if [ $rc -eq 0 ]; then
                        echo "Processed item"
                    else
                        echo "Failed item (exit $rc)"
                    fi
                    echo ""
                done
            else
                send_file_to_service "$skill_file" "skills"
                echo ""
            fi
        fi
    done
    echo "Skill data initialization completed"
}

read_access_token
initialize_races
initialize_realms
initialize_skill_categories
initialize_skills