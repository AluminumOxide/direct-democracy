#!/bin/bash

cd ../../services/api-democracy/source && cp ../spec.json . && npm install

cd ../../api-proposal/source && cp ../spec.json . && npm install

cd ../../api-membership/source && cp ../spec.json . && npm install

cd ../../api/source && cp ../spec.json . && npm install

cd ../../../infra/dev

docker build -t local-database -f ./local_database/Dockerfile ../../

docker build -t api-external -f ../../services/api/Dockerfile --build-arg API_PORT=3000 ../../services/api

docker build -t api-democracy -f ../../services/api-democracy/Dockerfile --build-arg API_PORT=3001 ../../services/api-democracy

docker build -t api-proposal -f ../../services/api-proposal/Dockerfile --build-arg API_PORT=3002 ../../services/api-proposal

docker build -t api-membership -f ../../services/api-membership/Dockerfile --build-arg API_PORT=3003 ../../services/api-membership
