FROM node:lts-alpine

ARG http_proxy
ARG https_proxy

ENV http_proxy=$http_proxy
ENV https_proxy=$https_proxy

# install simple http server for serving static content
RUN npm install -g spa-http-server

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
RUN npm run build

# set environment variable for the port
ENV PORT 8080

EXPOSE $PORT
CMD [ "http-server", "dist", "-p 8080", "--push-state" ]

