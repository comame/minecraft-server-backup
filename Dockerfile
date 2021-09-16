FROM node:alpine

RUN apk update && apk add \
    zip

USER node
COPY ./src /home/node/script

CMD node /home/node/script
