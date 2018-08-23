// var http = require('http');
//
// http.createServer(function (req, res) {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     console.log("access: "+req.url);
//
//     res.end();
// }).listen(8082);

const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
var url = require('url');
var rmlparser = require('./rml-parser');


app.set('view engine', 'pug')
app.use(express.static('views'))

app.get('/', (req, res) =>
  res.send('Hello World!'))


app.get('/testAhmad', function (req, res) {
  //get_jsonld_from_mapping()
    generate_schema("Persona", "Person",{"nombre": "name"})
    res.render('transform', {message: 'Hello there from Ahmad!' })
})

app.get('/testFreddy', function (req, res) {
  var q = url.parse(req.url, true).query;
  var mappingUrl = q.mappingUrl
  console.log("mappingUrl = "+ mappingUrl)

  var className = getClassNameFromMapping(mappingUrl)
  console.log("className = "+ className)

  createSchemaPythonMongodb(className)
  res.render('transform', {message: 'Hello there from Freddy!' })
})

app.get('/transform', function (req, res){
    res.render('transform', {message: 'Hello there from Ahmad!' })
})

app.post('/transform', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
      if(req.body.prog_lang && req.body.dataset_type && req.body.mapping_url){
         transform(req.body.prog_lang, "r2rml", req.body.dataset_type, req.body.mapping_url)
         res.json({"msg": "success!"})
       }
      else{
        res.json({ "error": "parameters are not passed" });
        //res.send(JSON.stringify({"error":'expecting map_lang, prog_lang, and dataset_type' }))
      }
})


function transform(prog_lang, map_lang, dataset_type, mapping_url){
  create_resolver(prog_lang, map_lang, dataset_type, mapping_url)
}








function get_jsonld_from_mapping(mapping_url){
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://rdf-translator.appspot.com/convert/n3/json-ld/"+mapping_url, false);
    xhttp.send();
    console.log('reply: ');
    var j = JSON.parse(xhttp.responseText);
    var i;
    var item, new_item
    var k, keys
    //var subjectMap_id
    //var class_name
    var graph
    var res_data = {}
    //var className = get_class_name(j)
    var className = rmlparser.get_class_name(j)
    res_data["class_name"] = className
    console.log('className = ' + className)

    var listOfPredicateObject = rmlparser.get_predicate_object_map_list(j)
    console.log('listOfPredicateObject = ' + listOfPredicateObject)

    var logicalSource = rmlparser.get_logical_source(j)
    res_data["logical_source"] = logicalSource
    console.log('logicalSource = ' + logicalSource)
    var pairsOfPredicateObject = {}
    for(i=0;i<listOfPredicateObject.length;i++){
        predicateObjectMap = listOfPredicateObject[i];
        predicate = rmlparser.get_predicate(j, predicateObjectMap)
        console.log('predicate = ' + predicate)

        object = rmlparser.get_object(j, predicateObjectMap)
        console.log('object = ' + object)

        pairsOfPredicateObject[predicate] = object
    }
    res_data["predicate_object"] = pairsOfPredicateObject
    console.log('pairsOfPredicateObject = ' + JSON.stringify(pairsOfPredicateObject))
    console.log('res_data: '+JSON.stringify(res_data))
    return res_data
}

function create_resolver(prog_lang, map_lang, dataset_type, mapping_data){
  var data
    data = get_jsonld_from_mapping(mapping_data)
    generate_schema(data["class_name"], data["logical_source"], data["predicate_object"])
}

function create_resolver_python_mongodb(mapping_data){
    
}

function create_schema(prog_lang, map_lang, dataset_type){
    
}

function createSchemaPythonMongodb(className){
  var fs = require('fs');
 
  fs.readFile('templates/python/mongodb/schema.hbs', 'utf8', function(err, contents) {
    //console.log(contents);
    var replacedContents = contents

    
    replacedContents = replacedContents.replace(/{{MappingClass}}/g, className);
    replacedContents = replacedContents.replace(/{{MappingClassModel}}/g, className + 'Model');
    replacedContents = replacedContents.replace(/{{mappingClass}}/g, 'all' + className);

    console.log(replacedContents);

  });
 
  //console.log('after calling readFile');

}

function getClassNameFromMapping(mappingURL){
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://rdf-translator.appspot.com/convert/n3/json-ld/" + mappingURL, false);
  xhttp.send();
  //console.log('reply: ');
  //console.log(xhttp.responseText);
  var j = JSON.parse(xhttp.responseText);
  var i;
  var item
  for(i=0;i<j["@graph"].length;i++){
      item = j["@graph"][i];
      if("rr:class" in item){
          con_arr = item["rr:class"]["@id"].split(":")
          model_name =  con_arr[con_arr.length-1]
          console.log("model name: "+model_name)
      }
      else{
          
      }
  }

  return model_name
}


function generate_schema(class_name, logical_source, predicate_object){
    // class_name: in graph ql
    // logical_source: table name
    //predicate_object: mapping between graph ql attributes and concept properties in the db
    var t=""
    t+= generate_schema_header(logical_source)
    t+= generate_schema_class(class_name, logical_source, predicate_object)
    t+= generate_schema_body(class_name, logical_source)
    console.log(t)
}

function generate_schema_header(logical_source){
    var db_model_as_name = logical_source+"Model"
    var t="import graphene\n"
    t+="from graphene_mongo import MongoengineObjectType\n"
    t+="from models import "+logical_source+" as "+db_model_as_name+"\n"
    return t
}

function generate_schema_class(class_name, logical_source, predicate_object){
    var db_model_as_name = logical_source+"Model"
    var v_att,i,t = "class "+class_name+"(graphene.ObjectType):\n"
    var predicates = Object.keys(predicate_object)
    for(i=0;i<predicates.length;i++){
        v_att = predicates[i]
        t+="\t"+v_att+" = graphene.String()\n"
    }
    for(i=0;i<predicates.length;i++){
        v_att = predicates[i]
        a_att = predicate_object[predicates[i]]
        t+="\tdef resolve_"+v_att+"(self, info):\n"
        t+="\t\treturn "+db_model_as_name+".objects.get(id=self.id)."+a_att+"\n"
    }
    return t
}

function generate_schema_body(class_name, logical_source){
    var db_model_as_name = logical_source+"Model"
    var t=""
    t+= "class Query(graphene.ObjectType):\n"
    t+= "\t"+class_name+"s = graphene.List("+class_name+")\n"
    t+= "\tdef resolve_personas(self, info):\n"
    t+= "\t\treturn list("+db_model_as_name+".objects.all())\n"
    t+= "schema = graphene.Schema(query=Query)\n"
    return t
}




app.listen(8082, () => console.log('Example app listening on port 8082!'))














