# morph-GraphQL

## EXAMPLE LinGBM: Translating mappings online for Javascript and LinGBM dataset in SQLite database (assuming that you have npm and node or docker installed)

### Dataset
- in sqlite: https://github.com/oeg-upm/morph-graphql/raw/master/examples/LinGBM/LinGBM1000.db

### Mapping
- r2rml: https://raw.githubusercontent.com/oeg-upm/morph-graphql/master/examples/LinGBM/LinGBM.r2rml.ttl

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
1. ```mkdir LinGBM1000```
2. ```cd LinGBM1000```
3. Translate the corresponding mappings: 
   ```curl -X POST http://localhost:8082/transform -H 'Content-Type: application/json' -d '{ "prog_lang": "javascript", "dataset_type":"sqlite", "mapping_url":"https://raw.githubusercontent.com/oeg-upm/morph-graphql/master/examples/LinGBM/LinGBM.r2rml.ttl", "db_name":"LinGBM1000.db", "mapping_language":"r2rml", "queryplanner":"joinmonster" }' > LinGBM1000.zip```
4. ```unzip LinGBM1000.zip```
5. ```wget https://github.com/oeg-upm/morph-graphql/raw/master/examples/LinGBM/LinGBM1000.db```
6. ```mv LinGBM1000.db data```
7. ```npm install```
8. ```npm start```
9. Go to http://localhost:4321/graphql from your browser, use some of the queries below

### Queries

#### q1
```
query offer_product_review {
  listOffer(identifier: "http://lingbm.linkeddata.es/offer/2") {
    identifier
    productWithReview {
      identifier
      review {
        identifier
        title
        text
        reviewDate
        publishDate
        rating1
        rating2
      }
    }
  }
}
```

#### q2
```
query producer_product_review {
  listProductWithReview {
    identifier
    producer(identifier: "http://lingbm.linkeddata.es/producer/8") {
      identifier
    }
    review {
      identifier
      title
    }
  }
}
```

#### q4
```
query offer_product_review_person_country {
  listOffer(identifier: "http://lingbm.linkeddata.es/offer/2") {
    identifier
    productWithReview {
      identifier
      label
      comment
      review {
        identifier
        title
        text
        rating1
        rating2
        rating3
        rating4
        reviewer {
          country {
            code
          }
        }
      }
    }
  }
}
```

#### q6
```
query vendor_offer_product_producer_country {
  listOffer {
    identifier
    vendor(identifier: "http://lingbm.linkeddata.es/vendor/1") {
      identifier
    }
    product {
      identifier
      producer {
        identifier
        country {
          identifier
          code
        }
      }
    }
  }
}
```

#### q11
```
query subquerySearch {
  listOffer {
    identifier
    price
    offerWebpage
    vendor(identifier: "http://lingbm.linkeddata.es/vendor/1") {
      identifier
    }
    product {
      identifier
      label
      comment
    }
  }
}
```


#### q12
```
query subqueryFilter1 {
  listOffer {
    identifier
    price
    offerWebpage
    vendor(identifier: "http://lingbm.linkeddata.es/vendor/1") {
      identifier
    }
    product {
      identifier
      label
      comment
      producer(identifier: "http://lingbm.linkeddata.es/producer/16") {
        identifier
      }
    }
  }
}
```
