FROM node:8.12

MAINTAINER dataintegration@delicias.dia.fi.upm.es

WORKDIR /mapping-translator


COPY package*.json ./
RUN npm install
COPY . .

CMD ["node", "app.js"]

EXPOSE 4321
