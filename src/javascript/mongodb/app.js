import express from "express";
import bodyParser from "body-parser";
import url from "url";
import JSZip from "jszip";
import zipper from "zip-local";
import archiver from "archiver";
import { createGraphqlSchema } from "mongo-graphql-starter";
import path from "path";
import * as fs from "file-system";
//import * as rmlParser from "./RML-Mapper2/index.js";
//import * as converter from "./JSONtoArray.js";
import rocketrml from "rocketrml";
import * as transformer from "./transformer.js";
import mkdirp from "mkdirp";

const app = express();//Se lanza la app

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'pug');
app.use(express.static('views'));

app.get('/', function (req, res){
  res.render('home.pug', {message: 'TFG-GraphQL:    Bases de datos MongoDB representadas en mappings RML a GraphQL resolvers'})
});

app.get('/transform', function (req, res){
  res.render('transform', {message: 'TFG-GraphQL:    Bases de datos MongoDB representadas en mappings RML a GraphQL resolvers'})
});

app.post('/transform', function (req, res) {
	if (!req.body) { return res.sendStatus(400) }

  if(req.body.db_url && req.body.db_name && req.body.mapping_path && req.body.output_folder && req.body.port_no){

      generateOutput(req.body.mapping_path, req.body.output_folder);
      generateServer(req.body.db_url, req.body.db_name, req.body.port_no, req.body.output_folder);
			res.redirect('/');

		} else {
      res.json({ "error": "todos los parámetros son necesarios" });
  }
});

function deleteFolder(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) {
        deleteFolder(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

//deleteFolder('./output/' + testProjectFolder);

function generateOutput(mappingPath, testProjectFolder){

deleteFolder('./output/' + testProjectFolder);

mkdirp('/home/david/Escritorio/TFG-GraphQL/output/' + testProjectFolder + '/rml', function(err) {});

let options={
};

/*Llamamos a Rocket para parsear el mapping*/
let result = rocketrml.parseFile(mappingPath, './output/' + testProjectFolder + '/rml/out.json',options).
catch((err) => {
    console.log(err);
});
/*El parseo del mapping ha ido bien*/
result.then(() => {
  var fileJSON = transformer.convertRDF('./output/' + testProjectFolder + '/rml/out.json');
  //var dataTypesObj = fileJSON[0].dataTypes;

  var texto = "import { dataTypes } from \"mongo-graphql-starter\";\n"
            + "const {\n"
            + "\tMongoIdType,\n"
            + "\tMongoIdArrayType,\n"
            + "\tStringType,\n"
            + "\tStringArrayType,\n"
            + "\tBoolType,\n"
            + "\tIntType,\n"
            + "\tIntArrayType,\n"
            + "\tFloatType,\n"
            + "\tFloatArrayType,\n"
            + "\tarrayOf,\n"
            + "\tobjectOf,\n"
            + "} = dataTypes;\n\n";

  for(var j in fileJSON){
    texto += "export const " + fileJSON[j].tabla + " = {\n"

    if(fileJSON[j].atributos[0].split("-")[0] == "_id"){
      texto += "\ttable: \"" + fileJSON[j].tabla.toLowerCase() + "s\",\n"
            +  "\tfields: {\n";
    }
    else{
      texto += "\tfields: {\n";
    }
    var i;
    for(i = 0; i < fileJSON[j].atributos.length; i++){
      var arraySplit = [];
      if(i == fileJSON[j].atributos.length - 1){//Ultima pos, no añadir coma
        arraySplit = fileJSON[j].atributos[i].split("-");//0-->nombre campo 1-->dataType
        if(arraySplit[2] == 'objectRelationship' || arraySplit[2] == 'arrayRelationship'){
          texto += "\t\tget " + arraySplit[0] + "() {\n"
                 + "\t\t\treturn " + arraySplit[1] + ";\n"
                 + "\t\t}\n"
        }
        else{
          if(arraySplit[0] == '_id'){
            texto += "\t\t" + arraySplit[0] + ": MongoIdType\n";
          }
          else{
            texto += "\t\t" + arraySplit[0] + ": " + arraySplit[1] + "\n";
          }
        }
      }
      else{
        arraySplit = fileJSON[j].atributos[i].split("-");//0-->nombre campo 1-->dataType 2-->si es una relationship
        if(arraySplit[2] == 'objectRelationship' || arraySplit[2] == 'arrayRelationship'){
          texto += "\t\tget " + arraySplit[0] + "() {\n"
                 + "\t\t\treturn " + arraySplit[1] + ";\n"
                 + "\t\t},\n"
        }
        else{
          if(arraySplit[0] == '_id'){
            texto += "\t\t" + arraySplit[0] + ": MongoIdType,\n";
          }
          else{
            texto += "\t\t" + arraySplit[0] + ": " + arraySplit[1] + ",\n";
          }
        }
      }
    }
    texto += "\t}\n"
           + "};\n\n";
  }

  fs.writeFile('/home/david/Escritorio/TFG-GraphQL/output/' + testProjectFolder + '/projectSetup.js', texto, function(err) {});

  /*El projectSetup se ha creado, llamamos a mongo-graphql-starter para crear los resolvers*/
  import('./output/' + testProjectFolder + '/projectSetup.js').then((ProjectSetup) => {
       createGraphqlSchema(ProjectSetup, path.resolve("./output/" + testProjectFolder)).then(() => {
         console.log('GraphQL resolvers generados con éxito');
       });
  });
});
}


function generateServer(dbUrl, dbName, portNumber, testProjectFolder){
  var texto = "import { MongoClient } from \"mongodb\";\n"
            + "import expressGraphql from \"express-graphql\";\n"
            + "import resolvers from \"./graphQL/resolver.js\";\n"
            + "import schema from \"./graphQL/schema.js\";\n"
            + "import { makeExecutableSchema } from \"graphql-tools\";\n"
            + "import express from \"express\";\n\n"
            + "const app = express();\n\n"
            + "const connString = \"" + dbUrl + "\";\n\n"
            + "const mongoClientPromise = MongoClient.connect(connString, { useNewUrlParser: true });\n"
            + "const mongoDbPromise = mongoClientPromise.then(client => client.db(\"" + dbName + "\"));\n\n"
            + "const root = { client: mongoClientPromise, db: mongoDbPromise };\n"
            + "const executableSchema = makeExecutableSchema({ typeDefs: schema, resolvers });\n\n"
            + "app.use(\"/graphql\", expressGraphql({\n"
            + "\t\tschema: executableSchema,\n"
            + "\t\tgraphiql: true,\n"
            + "\t\trootValue: root\n"
            + "\t})\n"
            + ");\n\n"
            + "app.listen(" + portNumber + ", () => console.log(`Servidor GraphQL ejecutando en http://localhost:" + portNumber + "/graphql`));";

  fs.writeFile('./output/' + testProjectFolder + '/server.js', texto, function(err) {});
}

app.listen(8080, () => console.log(`Servidor ejecutando en el puerto 8080`));
