FROM node:13.8

WORKDIR /usr/src/app

RUN mkdir run
RUN mkdir logs/
RUN mkdir bin
RUN apt-get update && apt-get upgrade -y && apt-get autoremove && apt-get autoclean
# most of these are for lxml which needs a bunch of dependancies installed
RUN apt-get install -y vim

RUN git clone -b docker https://github.com/diging/vogon-web-client.git
RUN mkdir /dist
WORKDIR /usr/src/app/vogon-web-client
RUN npm install
RUN npm run build
COPY startup.sh ./
RUN ["chmod", "+x", "/usr/src/app/vogon-web-client/startup.sh"]

ENTRYPOINT ["./startup.sh"]