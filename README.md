# morph-GraphQL
Translate OBDA mappings (R2RML/RML) into GraphQL Resolvers

## Installation Instructions
With Node:
1. ```git clone https://github.com/oeg-upm/morph-graphql```
2. ```cd morph-graphql```
3. ```cd javascript```
4. ```cd rdb```
5. ```npm install```
6. ```node app.js```

With docker:
1. ```docker run -d -p 8082:8082 --name mapping-translator oegdataintegration/mapping-translator:1.0```


## Running
visit ```http://127.0.0.1:8082/```


## Examples
### Example Starwars: 
Translating mappings online for Javascript and a set of CSV files (assuming that you have npm and node or docker installed)
- https://github.com/oeg-upm/morph-graphql/tree/master/examples/starwars

### EXAMPLE LinGBM Benchmark: 
Translating mappings online for Javascript and LinGBM benchmark dataset (assuming that you have npm and node or docker installed)
- https://github.com/oeg-upm/morph-graphql/tree/master/examples/LinGBM
