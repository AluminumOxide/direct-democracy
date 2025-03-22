#!/bin/sh

npm install
if [ $ENV = 'dev' ]; then
	npm run dev
else
	npm run start
fi


