#!/bin/sh

cp ~/.npmrc .
cp ../spec.json ./
npm install
npm publish
