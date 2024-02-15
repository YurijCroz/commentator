FROM node:16-alpine3.14

RUN mkdir /server

WORKDIR /server

COPY package*.json ./

RUN npm install -g sequelize-cli

RUN npm install

COPY . .

EXPOSE 4000

CMD sequelize db:migrate && npm start