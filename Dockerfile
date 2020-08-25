FROM node:14

USER root

RUN mkdir /server
WORKDIR /server

ADD package*.json ./

RUN npm install

ADD . ./

RUN npm run build

EXPOSE 3000
