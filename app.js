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
app.set('view engine', 'pug')
app.use(express.static('views'))

app.get('/', (req, res) =>
  res.send('Hello World!'))


app.get('/testAhmad', function (req, res) {
  get_jsonld_from_mapping()
  res.render('transform', {message: 'Hello there from Ahmad!' })
})

app.get('/testFreddy', function (req, res) {
  create_schema_python_mongodb()
  res.render('transform', {message: 'Hello there from Freddy!' })
})

app.post('/transform', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  //prog_lang
  //map_lang
  //dataset_type
  if(req.body.map_lang && req.body.prog_lang && req.body.dataset_type){
    //call the transform function
    //res.send(JSON.stringify({ "msg": "parameters are passed successfully" }))
    if(req.body.mapping_url){
      res.json({"msg": "the url is passed"})
    }
    else{
      res.json({"error": "the mapping_url is not passed"})
    }
  }
  else{
    res.json({ "error": "parameters are not passed" });
    //res.send(JSON.stringify({"error":'expecting map_lang, prog_lang, and dataset_type' }))
  }
})


function transform(prog_lang, map_lang, dataset_type){
  create_schema(prog_lang, map_lang, dataset_type)
  create_resolver(prog_lang, map_lang, dataset_type)
}

function get_jsonld_from_mapping(){
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://rdf-translator.appspot.com/convert/n3/json-ld/https://raw.githubusercontent.com/oeg-upm/mapping-translator/master/example/43LR95CY57.rml.ttl", false);
    xhttp.send();
    console.log('reply: ');
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
}

function create_resolver(prog_lang, map_lang, dataset_type, mapping_data){
    
}

function create_resolver_python_mongodb(mapping_data){
        mapping_data
}

function create_schema(prog_lang, map_lang, dataset_type){
    
}

function create_schema_python_mongodb(){
  var fs = require('fs');
 
  fs.readFile('templates/python/mongodb/schema.hbs', 'utf8', function(err, contents) {
    //console.log(contents);
    var replacedContents = contents

    replacedContents = replacedContents.replace(/{{MappingClass}}/g, 'Request');
    replacedContents = replacedContents.replace(/{{MappingClassModel}}/g, 'RequestModel');
    replacedContents = replacedContents.replace(/{{mappingClass}}/g, 'request');

    console.log(replacedContents);

  });
 
  //console.log('after calling readFile');

}





app.listen(8082, () => console.log('Example app listening on port 8082!'))
