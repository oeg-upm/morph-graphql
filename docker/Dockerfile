FROM node:lts

MAINTAINER dataintegration@delicias.dia.fi.upm.es

RUN curl -s https://api.github.com/repos/oeg-upm/morph-graphql/releases/latest | grep "zipball" | awk '{print $2}' | sed "s/[\",]//g" | xargs wget -O "latest.zip"
RUN unzip latest.zip

RUN mv /oeg-upm-morph-graphql* /morph-graphql
RUN rm /latest.zip

WORKDIR /morph-graphql/javascript/rdb/

RUN npm install

CMD ["node", "app.js"]

EXPOSE 8082
