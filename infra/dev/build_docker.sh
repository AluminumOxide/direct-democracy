#!/bin/bash

cd ../../services/api-democracy/source && cp ../spec.json . && npm install

cd ../../api-proposal/source && cp ../spec.json . && npm install

cd ../../../infra/dev

docker build -t local-database -f ./local_database/Dockerfile ../../

docker build -t api-democracy -f ../../services/api-democracy/Dockerfile --build-arg API_PORT=3000 ../../services/api-democracy

docker build -t api-proposal -f ../../services/api-proposal/Dockerfile --build-arg API_PORT=3001 ../../services/api-proposal
