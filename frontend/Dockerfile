FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies before copying the rest of the app, so that
# this step can be cached.
COPY package.json ./
RUN npm install

# Copy the rest of the project.
COPY . ./
