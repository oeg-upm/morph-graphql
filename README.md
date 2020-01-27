# morph-GraphQL
Translate OBDA mappings (R2RML/RML) into GraphQL Resolvers

## Current supported languages

Columns: resolvers

Rows: generators

Cells: data source

|                | JavaScript   | Java    | Python  |
|----------------|--------------|---------|---------|
| **JavaScript** | SQLite / CSV |         | MongoDB |
| **Java**       |              | MongoDB |         |


## JavaScript generator

### Install instructions

#### Git

1. ```git clone https://github.com/oeg-upm/morph-graphql```
2. ```cd morph-graphql/javascript/rdb```
5. ```npm install```
6. ```node app.js```
7. Open ```http://127.0.0.1:8082/```


#### Docker

1. ```docker run -d -p 8082:8082 --name morph-graphql morph-graphql```
2. Open ```http://127.0.0.1:8082/```

## Java generator

### TO-DO
