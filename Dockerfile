FROM node:11.6.1 AS builder

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]