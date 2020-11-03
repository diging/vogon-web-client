#!/bin/bash
mkdir run
mkdir logs/
mkdir bin
apt-get update && apt-get upgrade -y && apt-get autoremove && apt-get autoclean
# most of these are for lxml which needs a bunch of dependancies installed
cp  ../host/.env .


npm install
npm run build
cp -r dist ../host/
