#!/bin/bash

cd local_certs

# root keys
openssl genrsa -des3 -passout pass:password -out devCA.key  2048 
openssl req -x509 -new -subj "/C=CA/ST=ON/O=direct-democracy" -nodes -key devCA.key -sha256 -days 1825 -passin pass:password -out devCA.pem
sudo cp devCA.pem /usr/local/share/ca-certificates/devCA.crt
sudo update-ca-certificates
