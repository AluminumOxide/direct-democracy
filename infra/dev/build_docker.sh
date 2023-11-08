#!/bin/bash

# install node packages
cp ~/.npmrc .
cp .npmrc ../../services/api-democracy/
cp .npmrc ../../services/api-membership/
cp .npmrc ../../services/api-proposal/
cp .npmrc ../../services/api/
cd ../../services/api-democracy/source && cp ../spec.json .
cd ../../services/api-membership/source && cp ../spec.json .
cd ../../services/api-proposal/source && cp ../spec.json .
cd ../../api/source && cp ../spec.json . && npm install

cd ../../../infra/dev

# build test data
SERVICES=(democracy membership proposal)
first=true
echo "{" > test.json
for s in ${SERVICES[@]}; do
	if $first; then
		first=false
	else
		echo "," >> test.json
	fi
	second=true
        for f in `ls ../../services/api-$s/schema/*.json | xargs -n 1 basename -s .json`; do
		if $second; then
			second=false
		else
			echo "," >> test.json
		fi
                echo "\"$f\":{" >> test.json
                sed 's/^\(.*\),"_test":\(.*\)}$/\2:\1}/g' ../../services/api-$s/schema/$f.json | sed -e "$ ! s/$/,/" >> test.json
                echo "}" >> test.json
        done
done
echo "}" >> test.json
cp test.json ../../services/api-democracy/source/test/
cp test.json ../../services/api-membership/source/test/
cp test.json ../../services/api-proposal/source/test/

# build docker containers
docker build -t local-database -f ./local_database/Dockerfile ../../

docker build -t api-external -f ../../services/api/Dockerfile --build-arg API_PORT=3000 ../../services/api

docker build -t api-democracy -f ../../services/api-democracy/Dockerfile --build-arg API_PORT=3001 ../../services/api-democracy

docker build -t api-proposal -f ../../services/api-proposal/Dockerfile --build-arg API_PORT=3002 ../../services/api-proposal

docker build -t api-membership -f ../../services/api-membership/Dockerfile --build-arg API_PORT=3003 ../../services/api-membership
