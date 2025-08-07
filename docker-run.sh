#!/bin/bash

docker stop rmu-api-core

docker rm rmu-api-core

docker rmi labcabrera/rmu-api-core:latest

docker build -t labcabrera/rmu-api-core:latest .

docker run -d -p 3001:3001 --network rmu-network --name rmu-api-core -h rmu-api-core \
    -e PORT='3001' \
    -e RMU_MONGO_CORE_URI='mongodb://admin:admin@rmu-mongo:27017/rmu-core?authSource=admin' \
    -e RMU_IAM_BASE_URL='http://rmu-keycloak:8080' \
    -e RMU_IAM_JWK_URI=http://rmu-keycloak:8080/realms/rmu-local/protocol/openid-connect/certs \
    -e RMU_IAM_REALM='rmu-local' \
    -e RMU_IAM_CLIENT_ID='rmu-client' \
    -e RMU_KAFKA_BROKERS='rmu-kafka-broker:9092' \
    -e RMU_KAFKA_PARTITION_COUNT='1' \
    labcabrera/rmu-api-core:latest

docker logs -f rmu-api-core
