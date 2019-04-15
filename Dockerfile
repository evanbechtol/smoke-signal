FROM node:10.15.2

# Update the below proxy and timezone arguments using "--build-arg" inputs during "docker build"
ARG http_proxy=http://10.125.198.138:8080
ARG https_proxy=http://10.125.198.138:8080
ARG no_proxy="mongo, e_auth"
ARG TZ=America/Chicago

# Set the proxy and timezone environment variables using "-e" inputs during "docker run"
ENV http_proxy=${http_proxy} https_proxy=${https_proxy} no_proxy=${no_proxy} TZ=${TZ}

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

