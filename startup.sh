#!/bin/bash
mkdir run
mkdir logs/
mkdir bin
apt-get update && apt-get upgrade -y && apt-get autoremove && apt-get autoclean
# most of these are for lxml which needs a bunch of dependancies installed
docker cp -r vogon-client-vol:.env vogon-client:/vogon-client
mkdir /vogon-client-vol/dist/
cd vogon-web-client
npm install
npm run build
docker cp -r vogon-client:/usr/src/app/vogon-web-client/dist vogon-client-vol:/usr/src/app/vogon-client/dist/

tail -f /dev/null