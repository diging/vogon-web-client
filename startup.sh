#!/bin/bash
mkdir run
mkdir logs/
mkdir bin
apt-get update && apt-get upgrade -y && apt-get autoremove && apt-get autoclean
# most of these are for lxml which needs a bunch of dependancies installed

mkdir /dist
npm install
npm run build
cp -r /usr/src/app/vogon-web-client/dist /dist/
source .env
tail -f /dev/null