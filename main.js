import { createGraphqlSchema } from "mongo-graphql-starter";
import path from "path";
import * as fs from "file-system";
import * as transformer from "./transformer.js";
import mkdirp from "mkdirp";
import rocketrml from "rocketrml";

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

function generateOutput(mappingPath, testProjectFolder){

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
          texto += "\t\t" + arraySplit[0] + ": " + arraySplit[1] + "\n";
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
          texto += "\t\t" + arraySplit[0] + ": " + arraySplit[1] + ",\n";
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


generateOutput('./input/mapping1.ttl', 'testProject11');

module.exports = { generateOutput };
