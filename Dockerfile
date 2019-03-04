FROM scmgr.eams.ericsson.net:5005/docker/node-base:10.15.2

# install simple http server for serving static content
RUN npm install -g spa-http-server

# create the "app" folder if it doesn't exist
RUN mkdir -p /app

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# Sinopia workaround (doesn't like modules with "." in the name)
RUN echo svg.select.js:registry=https://registry.npmjs.org/ >> ~/.npmrc

# install project dependencies
RUN npm install --production

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
RUN npm run build

# set environment variable for the port
ENV PORT 8080

EXPOSE $PORT
CMD [ "http-server", "dist", "-p 8080", "--push-state" ]
