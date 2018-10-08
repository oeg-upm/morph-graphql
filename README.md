# mapping-translator
Translate OBDA mappings (R2RML/RML) into GraphQL Resolvers

## EXAMPLE 1: Installing and Running the mapping translator
With Node:
1. ```git clone https://github.com/oeg-upm/mapping-translator```
2. ```cd mapping-translator```
3. ```npm install```
4. ```node app.js```

With docker:
1. ```docker run -d -p 8082:8082 --name mapping-translator oegdataintegration/mapping-translator:1.0```
### Translating mappings locallly for MongoDB and Python (Assuming that you have MongoDB, python and pip installed on your computer)
1. go to http://localhost:8082/transform
2. specify your rml mappings
3. click the "submit" button, hopefully a zip file containing all the necessary files will be generated
4. unzip that zip file and run the "startup.sh" script
5. Your graphql application is now ready at http://localhost:5000/graphql

### The mappings used in the examples (Person is mapped to Personas, givenName is mapped to nombre, familyname is mapped to apellido, name is mapped to nombre+apellido, email is mapped to correo)
- url: https://github.com/oeg-upm/mapping-translator/blob/master/examples/example1/personas.rml.ttl

### To query all persons 
```
query { Person { identifier name email } }
```
### To add a person
```
mutation {
  createPerson(name: "Oscar" email:"ocorcho@fi.upm.es") {
    identifier
    name
    email
  }
}
```


## EXAMPLE 3: Translating mappings online for Javascript and SQLite (assuming that you have npm and node installed)
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
   ```"mapping_url":"https://raw.githubusercontent.com/oeg-upm/mapping-translator/master/examples/example3/personas3.rml.ttl",```
   ```"db_name":"personas3.sqlite",```
   ```"mapping_language":"rml"```
   ```}' > output.zip```
5. ```unzip output.zip```
6. ```npm install```
7. ```node app.js```
8. Go to http://localhost:4321/graphql from your browser, use some of the queries below

### The mappings used in the examples (Person is mapped to Personas, name is mapped to nombre, email is mapped to correo)
- url: https://github.com/oeg-upm/mapping-translator/blob/master/examples/example3/personas3.rml.ttl

### To query all persons 
```
query {
  Person {
    identifier
    name
    givenName
    familyName
    email
  } 
}
```
### To add a person
```
mutation {
  createPerson(givenName: "David", familyName: "Chaves") {
    identifier
    givenName
    familyName
  }
}
```

## EXAMPLE 5: Translating mappings online for Javascript and a set of CSV files (assuming that you have npm and node installed)
1. ```mkdir output```
2. ```cd output```
3. Translate the corresponding RML: 
   ```curl -X POST ```
   ```  http://mappingtranslator.mappingpedia.linkeddata.es/transform ```
   ```  -H 'Content-Type: application/json' ```
   ```  -d '{ "prog_lang": "javascript", ```
   ```"dataset_type":"csv", ```
   ```"mapping_url":"https://raw.githubusercontent.com/oeg-upm/mapping-translator/master/examples/example5/personas5b.rml.ttl",```
   ```"db_name":"personas.sqlite",```
   ```"mapping_language":"rml"```
   ```}' > output.zip```
5. ```unzip output.zip```
6. ```npm install```
7. ```node app.js```
8. Go to http://localhost:4321/graphql from your browser, use some of the queries below

### The mappings used in the examples
- url: https://raw.githubusercontent.com/oeg-upm/mapping-translator/master/examples/example5/personas5b.rml.ttl
- Person is mapped to personas.csv, givenName is mapped to nombre, familyName is mapped to apellido, email is mapped to some function of nombre and apellido, name is mapped to the concatenation of nombre and apellido
- SocialMediaPosting is mapped to comentarios.csv, author is mapped to usuario, comment is mapped to mensaje


### To query all persons 
```
{
  Person {
    identifier
    familyName
    telephone
    email
    name
    givenName
  }
}
```

### To query all posts
```
query {
  SocialMediaPosting {
    identifier
    comment
    author
  }
}
```

### To add a person
```
mutation {
  createPerson(givenName: "David", familyName: "Chaves") {
    identifier
    givenName
    familyName
  }
}
```

### To query a person by their name
```
{
  Person(name: "David Chaves") {
    identifier
    familyName
    telephone
    email
    name
    givenName
  }
}
```

### To query a person by their email
```
{
  Person(email: "fpriyatna@fi.upm.es") {
    identifier
    familyName
    telephone
    email
    name
    givenName
  }
}
```



# Screenshot
![screenshot](https://github.com/oeg-upm/mapping-translator/raw/master/examples/screenshot.png)

![screenshot-graphql](https://github.com/oeg-upm/mapping-translator/raw/master/examples/screenshot-graphql.png)

