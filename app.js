const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const url = require('url');
const fs = require('fs');
const uuid = require('uuid');
const rmlparser = require('./rml-parser');
//var mongodbpythontransformer = require('./transformers/mongodb/python/mongodb-python-transformer');
const mongodbpythontransformer = require('./mongodb-python-transformer');

app.set('view engine', 'pug')
app.use(express.static('views'))

app.get('/', (req, res) =>
  res.send('Hello World!'))

app.get('/transform', function (req, res){
    res.render('transform', {message: 'Welcome to Mapping Translator!\nTranslate your OBDA mappings to GraphQL Resolvers'})
})

app.post('/transform', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
      if(req.body.prog_lang && req.body.dataset_type && req.body.mapping_url){
        create_resolver(req.body.prog_lang, req.body.mapping_language, req.body.dataset_type, req.body.mapping_url)
         res.json({"msg": "success!"})
       }
      else{
        res.json({ "error": "parameters are not passed" });
        //res.send(JSON.stringify({"error":'expecting map_lang, prog_lang, and dataset_type' }))
      }
})

function create_resolver(prog_lang, map_lang, dataset_type, mapping_url){
    console.log("prog_lang = "+ prog_lang)
    console.log("map_lang = "+ map_lang)
    console.log("dataset_type = "+ dataset_type)
    console.log("mapping_url = "+ mapping_url)

    if (!fs.existsSync("tmp")){
        fs.mkdirSync("tmp");
    }

    var random_text = uuid.v4();
    var project_dir = './tmp/'+random_text+"/";
    if (!fs.existsSync(project_dir)){
        fs.mkdirSync(project_dir);
    }
    
    var data;
    if(map_lang == 'rml') {
        data = rmlparser.get_jsonld_from_mapping(mapping_url)
    } else {
        console.log(map_lang + " is not supported yet!")
    }

    if(prog_lang == 'python' && dataset_type == 'mongodb') {
        var class_name = data["class_name"]
        var logical_source = data["logical_source"]
        var predicate_object = data["predicate_object"]

        var schema = mongodbpythontransformer.generateSchema(class_name, logical_source, predicate_object)
        console.log("generated schema = \n" + schema )
        
        fs.writeFile(project_dir+"schema.py", schema, function (err){
            if(err){
               console.log('ERROR saving schema: '+err);
            }
            });

        var model = mongodbpythontransformer.generateModel(class_name, logical_source, predicate_object)
        console.log("generated model = \n" + model )
        
        fs.writeFile(project_dir+"model.py", model, function (err){
                     if(err){
                        console.log('ERROR saving model: '+err);
                     }
                     });
    } else {
        console.log(prog_lang + "/" +  dataset_type + " is not supported yet!")
    }
    
}


app.listen(8082, () => console.log('Mapping Translator is listening on port 8082!'))
