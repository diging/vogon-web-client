#!/bin/bash
mkdir run
mkdir logs/
mkdir bin
apt-get update && apt-get upgrade -y && apt-get autoremove && apt-get autoclean
# most of these are for lxml which needs a bunch of dependancies installed
sudo docker cp -r vogon-client-vol:.env vogon-client:/vogon-client
mkdir /vogon-client/dist/
/vogon-web-client/npm install
/vogon-web-client/npm run build
sudo docker cp -r vogon-client:/usr/src/app/vogon-web-client/dist vogon-client-vol:/usr/src/app/vogon-client/dist/

tail -f /dev/null