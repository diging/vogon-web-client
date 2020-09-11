#!/bin/bash
mkdir run
mkdir logs/
mkdir bin
apt-get update && apt-get upgrade -y && apt-get autoremove && apt-get autoclean
# most of these are for lxml which needs a bunch of dependancies installed
cp  ../vogon-client-vol/.env .

cd ../vogon-client-vol/
mkdir dist/
cd ../vogon-web-client/
npm install
npm run build
cp -r dist ../vogon-client-vol/dist
