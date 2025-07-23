#!/bin/bash

cd local_certs

# external api
openssl genrsa -out api-external.local.key 2048
openssl req -new -subj "/C=CA/ST=ON/O=direct-democracy/OU=external-api" -key api-external.local.key -passin pass:password -out api-external.local.key.csr
openssl x509 -req -in api-external.local.key.csr -CA devCA.pem -CAkey devCA.key -CAcreateserial -passin pass:password -out api-external.local.crt -days 365 -sha256 -extfile local-key.ext
cp api-external.local.key ../../../services/api/source/ssl.key
cp api-external.local.crt ../../../services/api/source/ssl.crt
cp devCA.pem ../../../services/api/source/ssl.pem
docker cp devCA.pem api-external:/usr/local/share/ca-certificates/devCA.crt
docker cp api-external.local.crt api-external:/usr/local/share/ca-certificates/
docker exec api-external update-ca-certificates

# democracy api
openssl genrsa -out api-democracy.local.key 2048
openssl req -new -subj "/C=CA/ST=ON/O=direct-democracy/OU=democracy-api" -key api-democracy.local.key -passin pass:password -out api-democracy.local.key.csr
openssl x509 -req -in api-democracy.local.key.csr -CA devCA.pem -CAkey devCA.key -CAcreateserial -passin pass:password -out api-democracy.local.crt -days 365 -sha256 -extfile local-key.ext
cp api-democracy.local.key ../../../services/api-democracy/source/ssl.key
cp api-democracy.local.crt ../../../services/api-democracy/source/ssl.crt
cp devCA.pem ../../../services/api-democracy/source/ssl.pem
docker cp devCA.pem api-democracy:/usr/local/share/ca-certificates/devCA.crt
docker cp api-democracy.local.crt api-democracy:/usr/local/share/ca-certificates/
docker exec api-democracy update-ca-certificates

# proposal api
openssl genrsa -out api-proposal.local.key 2048
openssl req -new -subj "/C=CA/ST=ON/O=direct-democracy/OU=proposal-api" -key api-proposal.local.key -passin pass:password -out api-proposal.local.key.csr
openssl x509 -req -in api-proposal.local.key.csr -CA devCA.pem -CAkey devCA.key -CAcreateserial -passin pass:password -out api-proposal.local.crt -days 365 -sha256 -extfile local-key.ext
cp api-proposal.local.key ../../../services/api-proposal/source/ssl.key
cp api-proposal.local.crt ../../../services/api-proposal/source/ssl.crt
cp devCA.pem ../../../services/api-proposal/source/ssl.pem
docker cp devCA.pem api-proposal:/usr/local/share/ca-certificates/devCA.crt
docker cp api-proposal.local.crt api-proposal:/usr/local/share/ca-certificates/
docker exec api-proposal update-ca-certificates

# membership api
openssl genrsa -out api-membership.local.key 2048
openssl req -new -subj "/C=CA/ST=ON/O=direct-democracy/OU=membership-api" -key api-membership.local.key -passin pass:password -out api-membership.local.key.csr
openssl x509 -req -in api-membership.local.key.csr -CA devCA.pem -CAkey devCA.key -CAcreateserial -passin pass:password -out api-membership.local.crt -days 365 -sha256 -extfile local-key.ext
cp api-membership.local.key ../../../services/api-membership/source/ssl.key
cp api-membership.local.crt ../../../services/api-membership/source/ssl.crt
cp devCA.pem ../../../services/api-membership/source/ssl.pem
docker cp devCA.pem api-membership:/usr/local/share/ca-certificates/devCA.crt
docker cp api-membership.local.crt api-membership:/usr/local/share/ca-certificates/
docker exec api-membership update-ca-certificates

# account api
openssl genrsa -out api-account.local.key 2048
openssl req -new -subj "/C=CA/ST=ON/O=direct-democracy/OU=account-api" -key api-account.local.key -passin pass:password -out api-account.local.key.csr
openssl x509 -req -in api-account.local.key.csr -CA devCA.pem -CAkey devCA.key -CAcreateserial -passin pass:password -out api-account.local.crt -days 365 -sha256 -extfile local-key.ext
cp api-account.local.key ../../../services/api-account/source/ssl.key
cp api-account.local.crt ../../../services/api-account/source/ssl.crt
cp devCA.pem ../../../services/api-account/source/ssl.pem
docker cp devCA.pem api-account:/usr/local/share/ca-certificates/devCA.crt
docker cp api-account.local.crt api-account:/usr/local/share/ca-certificates/
docker exec api-account update-ca-certificates

# profile api
openssl genrsa -out api-profile.local.key 2048
openssl req -new -subj "/C=CA/ST=ON/O=direct-democracy/OU=profile-api" -key api-profile.local.key -passin pass:password -out api-profile.local.key.csr
openssl x509 -req -in api-profile.local.key.csr -CA devCA.pem -CAkey devCA.key -CAcreateserial -passin pass:password -out api-profile.local.crt -days 365 -sha256 -extfile local-key.ext
cp api-profile.local.key ../../../services/api-profile/source/ssl.key
cp api-profile.local.crt ../../../services/api-profile/source/ssl.crt
cp devCA.pem ../../../services/api-profile/source/ssl.pem
docker cp devCA.pem api-profile:/usr/local/share/ca-certificates/devCA.crt
docker cp api-profile.local.crt api-profile:/usr/local/share/ca-certificates/
docker exec api-profile update-ca-certificates

# token api
openssl genrsa -out api-token.local.key 2048
openssl req -new -subj "/C=CA/ST=ON/O=direct-democracy/OU=token-api" -key api-token.local.key -passin pass:password -out api-token.local.key.csr
openssl x509 -req -in api-token.local.key.csr -CA devCA.pem -CAkey devCA.key -CAcreateserial -passin pass:password -out api-token.local.crt -days 365 -sha256 -extfile local-key.ext
cp api-token.local.key ../../../services/api-token/source/ssl.key
cp api-token.local.crt ../../../services/api-token/source/ssl.crt
cp devCA.pem ../../../services/api-token/source/ssl.pem
docker cp devCA.pem api-token:/usr/local/share/ca-certificates/devCA.crt
docker cp api-token.local.crt api-token:/usr/local/share/ca-certificates/
docker exec api-token update-ca-certificates

