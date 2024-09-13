#!/bin/bash

docker stop rmu-api-core

docker rm rmu-api-core

docker rmi labcabrera/rmu-api-core:latest

docker build -t labcabrera/rmu-api-core:latest .

docker run -d -p 3003:3003 --network rmu-network --name rmu-api-core -h rmu-api-core -e MONGO_URI='mongodb://rmu-mongo:27017/rmu-core' -e PORT='3003' labcabrera/rmu-api-core:latest

docker logs -f rmu-api-core
