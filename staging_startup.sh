#!/bin/bash
apt-get update && apt-get upgrade -y && apt-get autoremove && apt-get autoclean && apt install yarn
cd ./host

yarn install
yarn run build
