#!/bin/bash

CONTAINER_ALREADY_STARTED="CONTAINER_ALREADY_STARTED_PLACEHOLDER"
if [ ! -e $CONTAINER_ALREADY_STARTED ]; then
    touch $CONTAINER_ALREADY_STARTED
    echo "-- First container startup --"
    mkdir run
	mkdir logs/
	mkdir bin
	apt-get update && apt-get upgrade -y && apt-get autoremove && apt-get autoclean
	# most of these are for lxml which needs a bunch of dependancies installed
	docker cp -r vogon-client-vol:.env vogon-client:/vogon-client
	cd ..
	cd vogon-client-vol
	mkdir dist/
	cd ..
	cd vogon-web-client
	npm install
	npm run build
	docker cp -r vogon-client:/usr/src/app/vogon-web-client/dist vogon-client-vol:/usr/src/app/vogon-client/dist/
else
    echo "-- Not first container startup --"
fi