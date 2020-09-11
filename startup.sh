#!/bin/bash
mkdir run
mkdir logs/
mkdir bin
apt-get update && apt-get upgrade -y && apt-get autoremove && apt-get autoclean
# most of these are for lxml which needs a bunch of dependancies installed

mkdir vogon-client/dist/
vogon-web-client/npm install
vogon-web-client/npm run build
sudo docker cp -r /usr/src/app/vogon-web-client/dist /usr/src/app/vogon-client/dist/
source vogon-client/.env
tail -f /dev/null