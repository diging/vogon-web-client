#!/bin/bash
mkdir run
mkdir logs/
mkdir bin
apt-get update && apt-get upgrade -y && apt-get autoremove && apt-get autoclean
# most of these are for lxml which needs a bunch of dependancies installed
cp -r .env ../vogon-client
cd ..
cd vogon-client-vol
mkdir dist/
cd ..
cd vogon-web-client
npm install
npm run build
cp -r vogon-client:/usr/src/app/vogon-web-client/dist vogon-client-vol:/usr/src/app/vogon-client/dist/
