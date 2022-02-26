#!/bin/sh

cp ~/.npmrc .
cp -r ../spec.json ./
npm install
npm publish
