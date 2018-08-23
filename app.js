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
  get_jsonld_from_mapping()
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
    //var className = get_class_name(j)
    var className = rmlparser.get_class_name(j)
    console.log('className = ' + className)

    var listOfPredicateObject = rmlparser.get_predicate_object_map_list(j)
    console.log('listOfPredicateObject = ' + listOfPredicateObject)
    return 

    var pred_obj_map_ids = []
    for(i=0;i<j["@graph"].length;i++){
        item = j["@graph"][i];
        if("rr:predicateObjectMap" in item){
            pred_obj_map_ids.push(item["rr:predicateObjectMap"]["@id"])
        }
    }
    
    var pred_obj_map_list = []
    for(i=0;i<j["@graph"].length;i++){
        item = j["@graph"][i];
         for(k=0;k<pred_obj_map_ids.length;k++){
              if(item["id@"]==pred_obj_map_ids[k]){
                    pred_obj_map_list.push({"predicate":""})                                  
              }
        }
    }
    
}

function create_resolver(prog_lang, map_lang, dataset_type, mapping_data){
  get_jsonld_from_mapping(mapping_data)
    
}

function create_resolver_python_mongodb(mapping_data){
        mapping_data
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



app.listen(8082, () => console.log('Example app listening on port 8082!'))
