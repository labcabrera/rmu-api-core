#!/bin/bash

docker stop rmu-api-npc

docker rm rmu-api-npc

docker rmi labcabrera/rmu-api-npc:latest

docker build -t labcabrera/rmu-api-npc:latest .

docker run -d -p 3002:3002 --network rmu-network --name rmu-api-npc -h rmu-api-npc -e MONGO_URI='mongodb://rmu-mongo:27017/rmu-npc' -e PORT='3002' labcabrera/rmu-api-npc:latest

docker logs -f rmu-api-npc
