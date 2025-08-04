#!/bin/bash

docker stop rmu-api-core

docker rm rmu-api-core

docker rmi labcabrera/rmu-api-core:latest

docker build -t labcabrera/rmu-api-core:latest .

docker run -d -p 3001:3001 --network rmu-network --name rmu-api-core -h rmu-api-core \
    -e PORT='3001' \
    -e RMU_MONGO_CORE_URI='mongodb://admin:admin@rmu-mongo:27017/rmu-core?authSource=admin' \
    -e RMU_KEYCLOAK_BASE_URL='http://rmu-keycloak:8080' \
    -e RMU_KEYCLOAK_REALM='rmu-local' \
    -e RMU_KEYCLOAK_CLIENT_ID='rmu-client' \
    labcabrera/rmu-api-core:latest

docker logs -f rmu-api-core
