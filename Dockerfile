FROM node:13.8

WORKDIR /usr/src/app
RUN git clone -b docker https://github.com/diging/vogon-web-client.git
WORKDIR /usr/src/app
RUN ["chmod", "+x", "/usr/src/app/vogon-web-client/startup.sh"]

ENTRYPOINT ["./startup.sh"]