# morph-GraphQL

## EXAMPLE Madrid EPW data: Translating mappings online for Javascript and some madrid weather data from a CSV file (assuming that you have npm and node or docker installed)

### Dataset
- in epw: https://raw.githubusercontent.com/oeg-upm/morph-graphql/master/examples/madrid-epw/ESP_Madrid.082210_IWEC.epw
- in csv: https://raw.githubusercontent.com/oeg-upm/morph-graphql/master/examples/madrid-epw/MADRID.csv

### Mapping
- csvw: https://raw.githubusercontent.com/oeg-upm/morph-graphql/master/examples/madrid-epw/csv-metadata-Madrid.json
- r2rml: https://raw.githubusercontent.com/oeg-upm/morph-graphql/master/examples/madrid-epw/MADRID_EPW.r2rml.ttl

### Queries


### Installation Instructions
With Node:
1. ```npm install```
2. ```git clone https://github.com/oeg-upm/morph-graphql```
3. ```cd morph-graphql```
4. ```cd javascript```
5. ```cd rdb```
6. ```npm install```
7. ```node app.js```

With docker:
1. ```docker run -d -p 8082:8082 --name mapping-translator oegdataintegration/mapping-translator:1.0```

### Running Instructions
1. ```mkdir madrid-epw```
2. ```cd madrid-epw```
3. Translate the corresponding mappings: 
   ```curl -X POST http://localhost:8082/transform -H 'Content-Type: application/json' -d '{ "prog_lang": "javascript", "dataset_type":"csv", "mapping_url":"https://raw.githubusercontent.com/oeg-upm/morph-graphql/master/examples/madrid-epw/MADRID_EPW.r2rml.ttl", "db_name":"madrid.sqlite", "mapping_language":"r2rml", "queryplanner":"joinmonster" }' > madrid.zip```
4. ```unzip madrid.zip```
5. ```npm install```
6. ```npm start```
7. Go to http://localhost:4321/graphql from your browser, use some of the queries below

