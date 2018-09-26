# mapping-translator
Translate OBDA mappings (R2RML/RML) into GraphQL Resolvers

## Installing and Running the mapping translator
1. ```git clone https://github.com/oeg-upm/mapping-translator```
2. ```cd mapping-translator```
3. ```npm install```
4. ```node app.js```

## Example 1: Translating mappings locallly for MongoDB and Python (Assuming that you have MongoDB, python and pip installed on your computer)
1. go to http://localhost:8082/transform
2. specify your rml mappings
3. click the "submit" button, hopefully a zip file containing all the necessary files will be generated
4. unzip that zip file and run the "startup.sh" script
5. Your graphql application is now ready at http://localhost:5000/graphql

## Example 2: Translating mappings online for Javascript and SQLite (assuming that you have npm and node installed)
1. ```mkdir output```
2. ```cd output```
3. Download the example database 
   - Linux: ```curl https://github.com/oeg-upm/mapping-translator/raw/master/examples/example1/personas.sqlite > personas.sqlite```
   - Windows ```curl https://github.com/oeg-upm/mapping-translator/raw/master/examples/example3/personas3windows.sqlite > personas3.sqlite```
4. Translate the corresponding RML: 
   ```curl -X POST ```
   ```  http://mappingtranslator.mappingpedia.linkeddata.es/transform ```
   ```  -H 'Content-Type: application/json' ```
   ```  -d '{ "prog_lang": "javascript", ```
   ```"dataset_type":"sqlite", ```
   ```"mapping_url":"https://raw.githubusercontent.com/oeg-upm/mapping-translator/master/examples/example1/personas.rml.ttl",```
   ```"db_name":"personas.sqlite",```
   ```"mapping_language":"rml"```
   ```}' > output.zip```
5. ```unzip output.zip```
6. ```npm install```
7. ```node app.js```
8. Go to http://localhost:4321 from your browser, use some of the queries below

## The mappings used in the examples (Person is mapped to Personas, name is mapped to nombre, email is mapped to correo)
- url: https://github.com/oeg-upm/mapping-translator/blob/master/examples/example1/personas.rml.ttl

## To query all persons 
```
query { Person { identifier name email } }
```
## To add a person
```
mutation {
  createPerson(name: "Oscar" email:"ocorcho@fi.upm.es") {
    identifier
    name
    email
  }
}
```

# Screenshot
![screenshot](https://github.com/oeg-upm/mapping-translator/raw/master/examples/screenshot.png)

![screenshot-graphql](https://github.com/oeg-upm/mapping-translator/raw/master/examples/screenshot-graphql.png)
