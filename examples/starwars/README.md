# EXAMPLE Starwars: Translating mappings online for Javascript and a set of CSV files (assuming that you have npm and node or docker installed)

## Dataset
![schema](https://raw.githubusercontent.com/oeg-upm/morph-graphql/master/examples/starwars/schema.png)
- url: https://github.com/oeg-upm/morph-graphql/tree/master/examples/starwars

## Mapping
- url: https://raw.githubusercontent.com/oeg-upm/morph-graphql/master/examples/starwars/mappings.r2rml.ttl

## Installation Instructions
- See: https://github.com/oeg-upm/morph-graphql

## Running Instructions
1. ```mkdir output```
2. ```cd output```
3. Translate the corresponding mappings: 
   ```curl -X POST http://localhost:8082/transform -H 'Content-Type: application/json' -d '{ "prog_lang": "javascript", "dataset_type":"csv", "mapping_url":"https://raw.githubusercontent.com/oeg-upm/morph-graphql/master/examples/starwars/mappings.r2rml.ttl", "db_name":"starwars.sqlite", "mapping_language":"r2rml", "queryplanner":"joinmonster" }' > output.zip```
4. ```unzip output.zip```
5. ```npm install```
6. ```npm start```
7. Go to http://localhost:4321/graphql from your browser, use some of the queries below

## Queries
![](https://raw.githubusercontent.com/oeg-upm/morph-graphql/master/examples/starwars/queries.png)

### To query the hero in every episode
```
{
  listHeroes {
    episode {
      identifier
      code
    }
    hero {
      identifier
      name
    }
  }
}
```

### to query for the ID and friends of R2-D2
```
{
  listCharacter(name: "R2 D2") {
    identifier
    name
    friends {
      identifier
      charid
      friendId
    }
  }
}
```

### to query for Luke Skywalker directly, using his ID
```
{
  listCharacter(identifier: "http://starwars.mappingpedia.linkeddata.es/character/1000") {
    name
  }
}
```

### to query for both Luke and Leia
```
query FetchLukeAndLeiaAliased {
  luke: listCharacter(identifier: "http://starwars.mappingpedia.linkeddata.es/character/1000") {
    name
  }
  leia: listCharacter(identifier: "http://starwars.mappingpedia.linkeddata.es/character/1003") {
    name
  }
}
```

### to verify that R2-D2 is a droid
```
{
  listCharacter(name: "R2 D2") {
    identifier
    name
    type(name: "Droid") {
      identifier
      name
    }
  }
}
```

### to verify that the hero of episode Empire is a human
```
{
  listHeroes {
    identifier
    hero {
      identifier
      name
      type(name: "Human") {
        identifier
        name
      }
    }
    episode(code: "Empire") {
      identifier
      code
    }
  }
}
```
