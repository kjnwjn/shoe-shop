FROM node:alpine3.16

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

COPY yarn.lock ./

RUN yarn --production

COPY . .

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start:prod" ]
