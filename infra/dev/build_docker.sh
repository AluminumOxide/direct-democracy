#!/bin/bash

# install node packages
cp .npmrc ../../services/api-democracy/source/
cp .npmrc ../../services/api-membership/source/
cp .npmrc ../../services/api-proposal/source/
cp .npmrc ../../services/api/source/
cp ../../services/api-democracy/spec.json ../../services/api-democracy/source/
cp ../../services/api-membership/spec.json ../../services/api-membership/source/
cp ../../services/api-proposal/spec.json ../../services/api-proposal/source/

# build test data
SERVICES=(democracy membership proposal)
first=true
echo "{" > .testdata.json
for s in ${SERVICES[@]}; do
	if $first; then
		first=false
	else
		echo "," >> .testdata.json
	fi
	second=true
        for f in `ls ../../services/api-$s/schema/*.json | xargs -n 1 basename -s .json`; do
		if $second; then
			second=false
		else
			echo "," >> .testdata.json
		fi
                echo "\"$f\":{" >> .testdata.json
                sed 's/^\(.*\),"_test":\(.*\)}$/\2:\1}/g' ../../services/api-$s/schema/$f.json | sed -e "$ ! s/$/,/" >> .testdata.json
                echo "}" >> .testdata.json
        done
done
echo "}" >> .testdata.json
cp .testdata.json ../../services/api-democracy/source/test/
cp .testdata.json ../../services/api-membership/source/test/
cp .testdata.json ../../services/api-proposal/source/test/

# build docker containers
docker build -t local-database -f ./local_database/Dockerfile ../../

docker build -t api-external -f ../../services/api/Dockerfile --build-arg API_PORT=3000 ../../services/api

docker build -t api-democracy -f ../../services/api-democracy/Dockerfile --build-arg API_PORT=3001 ../../services/api-democracy

docker build -t api-proposal -f ../../services/api-proposal/Dockerfile --build-arg API_PORT=3002 ../../services/api-proposal

docker build -t api-membership -f ../../services/api-membership/Dockerfile --build-arg API_PORT=3003 ../../services/api-membership
