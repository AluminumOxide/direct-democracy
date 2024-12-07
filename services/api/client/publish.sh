#!/bin/sh

cp ~/.npmrc .
cp ../spec.json ./
cp ../source/errors.json ./
npm install
npm publish
