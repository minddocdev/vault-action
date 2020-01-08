# ------------------------------------------------------
#                       Dockerfile
# ------------------------------------------------------
# image:    vault-action
# name:     minddocdev/vault-action
# repo:     https://github.com/minddocdev/vault-action
# Requires: minddocdev/node-alpine:latest
# authors:  development@minddoc.com
# ------------------------------------------------------

FROM minddocdev/node-alpine:latest

LABEL version="0.0.1"
LABEL repository="https://github.com/minddocdev/vault-action"
LABEL maintainer="MindDoc Health GmbH"

RUN apk add --no-cache nodejs npm

COPY lib/ /usr/src/
COPY package.json /usr/src

WORKDIR /usr/src
RUN npm install --only=prod

ENTRYPOINT ["node", "/usr/src/main.js"]
