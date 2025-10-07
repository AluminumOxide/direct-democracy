#!/bin/bash

cd local_certs

SERVICES=(token democracy membership proposal account profile external)

# make certs
for s in ${SERVICES[@]}; do
	openssl genrsa -out api-$s.local.key 2048
	openssl req -new -subj "/C=CA/ST=ON/O=direct-democracy/OU=$s-api" -key api-$s.local.key -passin pass:password -out api-$s.local.key.csr
	openssl x509 -req -in api-$s.local.key.csr -CA devCA.pem -CAkey devCA.key -CAcreateserial -passin pass:password -out api-$s.local.crt -days 365 -sha256 -extfile local-key.ext
	openssl genrsa -out api-$s.jwt.private.pem 2048
	openssl rsa -in api-$s.jwt.private.pem -outform DER -out api-$s.jwt.private.der
	openssl rsa -in api-$s.jwt.private.pem -outform DER -pubout -out api-$s.jwt.public.der	
done

# copy certs
for s in ${SERVICES[@]}; do
	docker exec api-$s bash -c "mkdir -p /app/certs"
	docker cp devCA.pem api-$s:/app/certs/ssl.pem
	docker cp api-$s.local.key api-$s:/app/certs/ssl.key
	docker cp api-$s.local.crt api-$s:/app/certs/ssl.crt
	docker cp api-$s.jwt.private.pem api-$s:/app/certs/jwt.private.pem
	docker cp api-$s.jwt.private.der api-$s:/app/certs/jwt.private.der
	docker cp api-$s.jwt.public.der api-$s:/app/certs/jwt.public.der	
	docker cp devCA.pem api-$s:/usr/local/share/ca-certificates/devCA.crt
	docker cp api-$s.local.crt api-$s:/usr/local/share/ca-certificates/
	docker exec api-$s update-ca-certificates


	for t in ${SERVICES[@]}; do
		if [ $s != $t ]; then
			docker cp api-$t.jwt.private.der api-$s:/app/certs/
			docker cp api-$t.jwt.public.der api-$s:/app/certs/
		fi
	done
done

docker cp devCA.pem ui:/app/certs/ssl.pem
docker cp devCA.pem ui:/usr/local/share/ca-certificates/devCA.crt
docker exec ui update-ca-certificates

