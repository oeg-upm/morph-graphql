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
//var mongodbpythontransformer = require('./transformers/mongodb/python/mongodb-python-transformer');
var mongodbpythontransformer = require('./mongodb-python-transformer');


app.set('view engine', 'pug')
app.use(express.static('views'))

app.get('/', (req, res) =>
  res.send('Hello World!'))


app.get('/testAhmad', function (req, res) {
  //get_jsonld_from_mapping()
    generate_schema("Person", "Persona",{"name": "nombre"})
    res.render('transform', {message: 'Hello there from Ahmad!' })
})

app.get('/testFreddy', function (req, res) {
  var q = url.parse(req.url, true).query;
  var mappingUrl = q.mappingUrl
  console.log("mappingUrl = "+ mappingUrl)

  var className = rmlparser.getClassNameFromMapping(mappingUrl)
  console.log("className = "+ className)

  mongodbpythontransformer.createSchemaPythonMongodb(className)
  res.render('transform', {message: 'Hello there from Freddy!' })
})

app.get('/transform', function (req, res){
    res.render('transform', {message: 'Hello there from Ahmad!' })
})

app.post('/transform', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
      if(req.body.prog_lang && req.body.dataset_type && req.body.mapping_url){
         transform(req.body.prog_lang, req.body.mapping_language, req.body.dataset_type, req.body.mapping_url)
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


function create_resolver(prog_lang, map_lang, dataset_type, mapping_url){
    console.log("prog_lang = "+ prog_lang)
    console.log("map_lang = "+ map_lang)
    console.log("dataset_type = "+ dataset_type)
    console.log("mapping_url = "+ mapping_url)

    var data;
    if(map_lang == 'rml') {
        data = rmlparser.get_jsonld_from_mapping(mapping_url)
    } else {
        console.log(map_lang + " is not supported yet!")
    }

    
    generate_schema(data["class_name"], data["logical_source"], data["predicate_object"])
}

function create_resolver_python_mongodb(mapping_data){
    
}

function create_schema(prog_lang, map_lang, dataset_type){
    
}


function generate_schema(class_name, logical_source, predicate_object){
    // class_name: in graph ql
    // logical_source: table name
    //predicate_object: mapping between graph ql attributes and concept properties in the db
    var t=""
    t+= mongodbpythontransformer.generate_schema_header(logical_source)
    t+= mongodbpythontransformer.generate_schema_class(class_name, logical_source, predicate_object)
    t+= mongodbpythontransformer.generate_schema_body(class_name, logical_source)
    console.log("generated resolver = \n" + t)
}





app.listen(8082, () => console.log('Mapping Translator is listening on port 8082!'))














