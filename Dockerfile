FROM node:16-alpine3.14

RUN apk add --no-cache python3 make g++ cairo-dev jpeg-dev pango-dev giflib-dev pkgconfig libjpeg-turbo-dev ttf-freefont

RUN mkdir /server

WORKDIR /server

COPY package*.json ./

RUN npm install -g sequelize-cli

RUN npm install

COPY . .

EXPOSE 4000

CMD sequelize db:migrate && npm start