var fs = require('fs');
const sqlitecretator = require('./sqlitecreator');

exports.generateSchema = function(mappingDocument) {


    //Type Query Generation

    var schema  ="";
    schema += "\ttype Query {" + "\n"
    mappingDocument.triplesMaps.map(function(triplesMap) {
        let class_name = triplesMap.subjectMap.className;
        let noOfPredicateObjectMaps = triplesMap.getNumberOfPredicateObjectMaps();
        //console.log(`noOfPredicateObjectMaps = ${noOfPredicateObjectMaps} ...`)

        console.log(`Building query arguments for triplesMap ${class_name} ...`)
        let queryArguments = triplesMap.genQueryArguments(true);

        schema += `\t\t${class_name}(${queryArguments.join(",")}): [${class_name}]\n`
    })

    schema += "\t}"  + "\n\n"

    //Type Mutation Generation

    schema += "\ttype Mutation {" + "\n"
    mappingDocument.triplesMaps.map(function(triplesMap) {
        let class_name = triplesMap.subjectMap.className;
        let noOfPredicateObjectMaps = triplesMap.getNumberOfPredicateObjectMaps();
        //console.log(`noOfPredicateObjectMaps = ${noOfPredicateObjectMaps} ...`)

        console.log(`Building mutation arguments for triplesMap ${class_name} ...`)
        let mutationArguments = triplesMap.genMutationArguments(true);

        schema += `\t\tcreate${class_name}(${mutationArguments.join(",")}): ${class_name}\n`
    })

    schema += "\t}"  + "\n"
    schema +=  "\n"

    //User Defined Types generation
    mappingDocument.triplesMaps.map(function(triplesMap) {
        let queryArguments = triplesMap.genQueryArguments(true);
        let class_name = triplesMap.subjectMap.className;
        schema += `\ttype ${class_name} {` +  "\n\t\t"
        schema += queryArguments.join("\n\t\t") + "\n"
        schema += "\t}"  + "\n\n"
    })



    //console.log("schema = \n" + schema)
    //console.log("\n\n\n")
    return schema;
}

exports.generateModel = function(mappingDocument) {
    let model = mappingDocument.triplesMaps.map(function(triplesMap) {
        let class_name = triplesMap.subjectMap.className;
        return `class ${class_name} {\n}`
    }).join("\n");
    //console.log("model = \n" + model)
    //console.log("\n\n\n")
    return model;

}

exports.generateResolvers = function(mappingDocument) {
    let queryResolversString = this.generateQueryResolvers(mappingDocument);
    //console.log("queryResolversString = \n" + queryResolversString)

    let mutationResolversString = this.generateMutationResolvers(mappingDocument);
    let resolversString = queryResolversString + "\t,\n" + mutationResolversString;

    //console.log("resolversString = \n" + resolversString)
    //console.log("\n\n\n")
    return resolversString;
}


exports.generateQueryResolvers = function(mappingDocument) {
    let result = mappingDocument.triplesMaps.map(function(triplesMap) {
        let logical_source = triplesMap.logicalSource;
        let class_name = triplesMap.subjectMap.className;
        let predicateObjectMaps = triplesMap.predicateObjectMaps;
        let alpha = triplesMap.getAlpha();
        //console.log(`alpha = ${alpha}`)

        let prSQLTriplesMap = triplesMap.genPRSQL().join(",");

        var queryResolvers = "";
        let queryArguments = triplesMap.genQueryArguments(false);

        queryResolvers += `\t${class_name}: function({${queryArguments.join(",")}}) {\n`

        let sqlSelectFrom = `SELECT ${prSQLTriplesMap} FROM ${alpha}`
        queryResolvers += "\t\tlet sqlSelectFrom = `" + sqlSelectFrom + "`\n"
        queryResolvers += `\t\tlet sqlWhere = []\n`

        let condSQLTriplesMap = triplesMap.genCondSQL();
        queryResolvers += condSQLTriplesMap.join("\n") + "\n"

        queryResolvers += '\t\tlet sql = "";\n'
        queryResolvers += '\t\tif(sqlWhere.length == 0) { sql = sqlSelectFrom} else { sql = sqlSelectFrom + " WHERE " + sqlWhere.join("AND") }\n';
        queryResolvers += '\t\tlet data = db.all(sql);\n'
        queryResolvers += "\t\tconsole.log(`sql = ${sql}`)\n"
        queryResolvers += '\t\tlet allInstances = [];\n'
        queryResolvers += '\t\treturn data.then(rows => {\n';
        queryResolvers += '\t\t\trows.forEach((row) => {\n';

        queryResolvers += "\t\t\t\t" + `let instance = new ${class_name}();\n`
        queryResolvers += predicateObjectMaps.reduce(function(filtered, predicateObjectMap) {
            let predicate = predicateObjectMap.predicate;
            let objectMap = predicateObjectMap.objectMap;

            if(objectMap.referenceValue) {
                filtered.push(`\t\t\t\t\instance.${predicate} = row["${objectMap.referenceValue}"];`)
            } else if(objectMap.template) {
                //let templateString = objectMap.template.split("{").join('${row["').split("}").join('"]}')
                //templateString = "`" + templateString + "`"
                //filtered.push(`\t\t\t\t\instance.${predicate} = ${templateString}`)

                let alias = '`${row["' + objectMap.getHashCode() + '"]}`';
                filtered.push(`\t\t\t\t\instance.${predicate} = ${alias}`)

            } else if(objectMap.functionString) {
                let alias = '`${row["' + objectMap.getHashCode() + '"]}`';
                filtered.push(`\t\t\t\t\instance.${predicate} = ${alias}`)
            }
            return filtered
        }, []).join("\n") + "\n";

        queryResolvers += '\t\t\t\tallInstances.push(instance);\n'
        queryResolvers += '\t\t\t})\n'
        queryResolvers += '\t\t\treturn allInstances;\n'
        queryResolvers += '\t\t});\n'
        queryResolvers += `\t}\n`

        //console.log("queryResolvers = \n" + queryResolvers)
        //console.log("\n\n\n")

        return queryResolvers;
    }).join(",\n");

    return result;
}

exports.generateMutationResolvers = function(mappingDocument) {
    let result = mappingDocument.triplesMaps.map(function(triplesMap) {
        let logical_source = triplesMap.logicalSource;
        let alphaTriplesMap = triplesMap.getAlpha();

        let class_name = triplesMap.subjectMap.className;
        let predicateObjectMaps = triplesMap.predicateObjectMaps;

        //let predicates = Object.keys(listOfPredicateObjectMap)
        let predicates = predicateObjectMaps.map(function(predicateObjectMap) {
            return predicateObjectMap.predicate;
        });

        //let objectMaps = Object.values(listOfPredicateObjectMap)
        let objectMaps = predicateObjectMaps.map(function(predicateObjectMap) {
            return predicateObjectMap.objectMap;
        });

        let columnNames = objectMaps.reduce(function(filtered, objectMap) {
            if(objectMap.referenceValue) {
                filtered.push(objectMap.referenceValue)
            }
            return filtered
        }, []).join(",");

        let mutationResolverString = ""
        /*
        mutationResolverString += `\tcreate${class_name}: function({`
        mutationResolverString += predicateObjectMaps.reduce(function(filtered, predicateObjectMap) {
          let predicate = predicateObjectMap.predicate;
          let objectMap = predicateObjectMap.objectMap;
          if(objectMap.referenceValue) {
            filtered.push(predicate)
          }
          return filtered
        }, []).join(",")
        mutationResolverString += `}) {\n`
        */

        let mutationArguments = triplesMap.genMutationArguments(false);
        mutationResolverString += `\tcreate${class_name}: function({${mutationArguments.join(",")}}) {\n`

        mutationResolverString += `\t\tif(identifier == undefined) { identifier = uuid.v4().substring(0,8) }\n`;
        mutationResolverString += predicateObjectMaps.reduce(function(filtered, predicateObjectMap) {
            let predicate = predicateObjectMap.predicate;
            let objectMap = predicateObjectMap.objectMap;
            if(objectMap.referenceValue) {
                if(predicate != 'identifier') {
                    filtered.push(`\t\tif(${predicate} == undefined) { ${predicate} = 'NULL'}	`)
                }
            }
            return filtered;
        }, []).join("\n")
        mutationResolverString += "\n"

        let valuesString = predicateObjectMaps.reduce(function(filtered, predicateObjectMap) {
            let predicate = predicateObjectMap.predicate;
            let objectMap = predicateObjectMap.objectMap;
            if(objectMap.referenceValue) {
                if(objectMap.datatype === 'String'){
                    filtered.push("'${" + predicate + "}'")
                }
                else{
                    filtered.push("${" + predicate + "}")
                }
            }
            return filtered
        }, []).join(",")
        //console.log("valuesString = " + valuesString)

        let sqlString = "`INSERT INTO " + alphaTriplesMap + "(" + columnNames +") VALUES(" + valuesString +")`";
        //console.log("sqlString = " + sqlString)

        mutationResolverString += `\t\tlet sqlInsert = ${sqlString}\n`;
        mutationResolverString += `\t\tlet status = db.run(sqlInsert).then(dbStatus => { return dbStatus });\n`;
        mutationResolverString += "\t\tconsole.log(`sql = ${sqlInsert}`)\n";


        let newInstanceString = predicateObjectMaps.reduce(function(filtered, predicateObjectMap) {
            let predicate = predicateObjectMap.predicate;
            let objectMap = predicateObjectMap.objectMap;
            if(objectMap.referenceValue) {
                filtered.push(`\t\tnewInstance.${predicate} = ${predicate}`)
            }
            return filtered
        }, []).join("\n")
        mutationResolverString += `\t\tlet newInstance = new ${class_name}()\n`;
        mutationResolverString += newInstanceString + "\n";
        mutationResolverString += `\t\treturn newInstance\n`;

        mutationResolverString += `\t}\n`

        //console.log(`mutationResolverString = \n${mutationResolverString}`)
        //console.log("\n\n\n")

        return mutationResolverString;
    }).join(",\n");
    return result;

}


exports.transform = function(triplesMap) {
    var schema = this.generateSchema(triplesMap);
    //console.log("schema = \n" + schema)

    var model = this.generateModel(triplesMap);
    //console.log("model = \n" + model)

    var resolvers = this.generateResolvers(triplesMap);
    //console.log("resolvers = \n" + resolvers)
}

exports.toLowerCaseFirstChar = function(str) {
    return str.substr( 0, 1 ).toLowerCase() + str.substr( 1 );
}

exports.generateApp = function(
    triplesMap,
    mappingDocument,
    //class_name,
    //logical_source,
    //predicateObjectMaps,
    db_name, port_no) {
    //console.log(`mappingDocument = ${mappingDocument}`);


    var appString = "";
    console.log("GENERATING SCHEMA ...");
    var schemaString = this.generateSchema(mappingDocument)
    console.log("GENERATING MODEL ...");
    var modelString = this.generateModel(mappingDocument)
    console.log("GENERATING RESOLVERS ...");
    var resolversString = this.generateResolvers(mappingDocument)

    appString += "const db = require('sqlite');\n"
    appString += "const express = require('express');\n"
    appString += "const graphqlHTTP = require('express-graphql');\n"
    appString += "const Promise = require('bluebird');\n"
    appString += "const uuid = require('uuid');\n"
    appString += "\n"
    appString += "var { buildSchema } = require('graphql');\n"
    appString += "\n"
    appString += "var schema = buildSchema(`\n"
    appString += schemaString
    appString += "`);\n"
    appString += modelString + "\n"
    appString += "\n"
    appString += "var root = { \n"
    appString += resolversString + "\n"
    appString += "};\n"
    appString += "const app = express();\n"
    appString += `const port = process.env.PORT || ${port_no};\n`
    appString += "app.use('/graphql', graphqlHTTP({schema: schema,  rootValue: root,  graphiql: true,}));\n"
    appString += "Promise.resolve().then(() => db.open('" + db_name + "', { Promise }))\n"
    appString += "\t.catch(err => console.error(err.stack))\n"
    appString += "\t.finally(() => app.listen(port));\n"
    appString += "\n"
    appString += `console.log('Running a GraphQL API server at localhost:${port_no}/graphql');\n`
    //console.log("appString = \n" + appString)

    return appString;
}

exports.generate_requirements = function(queryplanner){
  var content=null;
  if(queryplanner) {
    if(queryplanner == "joinmonster") {
      content=fs.readFileSync('./transformers/javascript/sqlite/joinmonster/package.json');
    } else {
      content=fs.readFileSync('./transformers/javascript/sqlite/package.json');
    }
  } else {
    content=fs.readFileSync('./transformers/javascript/sqlite/package.json');
  }

  return content;
}

exports.generate_statup_script_sh = function(){
    var content=fs.readFileSync('./transformers/javascript/startup.sh');
    return content;
}

exports.generate_statup_script_bat = function(){
    var content=fs.readFileSync('./transformers/javascript/startup.bat');
    return content;
}

exports.generate_docker_file = function () {
    var content = fs.readFileSync('./transformers/javascript/Dockerfile');
    return content;
}

exports.generate_docker_startup_sh = function () {
    var content = fs.readFileSync('./transformers/javascript/startupDocker.sh');
    return content;
}

exports.generate_docker_startup_bat = function () {
    var content = fs.readFileSync('./transformers/javascript/startupDocker.bat');
    return content;
}

exports.generateJoinMonsterServer = function () {
  let content=fs.readFileSync('./transformers/javascript/sqlite/joinmonster/server.js');
  return content;
}

exports.generateJoinMonsterFetch = function () {
  let content=fs.readFileSync('./transformers/javascript/sqlite/joinmonster/fetch.js');
  return content;
}

exports.generateDatabaseJS = function (db_name) {
    let dbJSString = "";
    dbJSString += "import path from 'path'\n"
    dbJSString += `const dataFilePath = path.join(__dirname, '../data/${db_name}')\n`
    dbJSString += `export default require('knex')({\n`
    dbJSString += "\tclient: 'sqlite3',\n"
    dbJSString += "\tconnection: {filename: dataFilePath},\n"
    dbJSString += "\tuseNullAsDefault: true\n"
    dbJSString += "})\n"

    return dbJSString;
}
  
exports.generateJoinMonsterBabelRc = function () {
  let content=fs.readFileSync('./transformers/javascript/sqlite/joinmonster/.babelrc');
  return content;
}

exports.generateJoinMonsterEslintrc = function () {
  let content=fs.readFileSync('./transformers/javascript/sqlite/joinmonster/.eslintrc.js');
  return content;
}

exports.generateJoinMonsterIndex = function () {
  let content=fs.readFileSync('./transformers/javascript/sqlite/joinmonster/index.js');
  return content;
}

exports.generateJoinMonsterQueryRoot = function (mappingDocument) {
  let content = "";
  content += "import {GraphQLObjectType,GraphQLList,GraphQLNonNull,GraphQLString,GraphQLInt} from 'graphql'\n"
  content += `import joinMonster from 'join-monster'\n`
  content += `import knex from './database'\n`
  content += "import dbCall from '../data/fetch'\n"
  content += mappingDocument.triplesMaps.map(function(triplesMap) {
    let className = triplesMap.subjectMap.className;
    return `import ${className} from './${className}'`
  }).join("\n") + "\n";

  content += "export default new GraphQLObjectType({\n"
  content += "\tdescription: 'global query object',\n"
  content += "\tname: 'Query',\n"
  content += "\tfields: () => ({\n"
  content += "\t\tversion: { type: GraphQLString, resolve: () => joinMonster.version },\n"
  content += mappingDocument.triplesMaps.map(function(triplesMap) {
    let className = triplesMap.subjectMap.className;
    let listInstancesResolver = `\t\tlist${className}: { type: new GraphQLList(${className}), resolve: (parent, args, context, resolveInfo) => {\n`
    listInstancesResolver += "\t\t\treturn joinMonster(resolveInfo, context, sql => dbCall(sql, knex, context))\n"
    listInstancesResolver += "\t\t}}\n"
    return listInstancesResolver
  }).join(",\n") + "\n";


  content += "\t})\n"
  content += "})\n"
  return content;
}

exports.generateJoinMonsterResolvers = function (triplesMap) {
  let additionalImports = [];
  let className = triplesMap.subjectMap.className;
  let tmAlpha = triplesMap.getAlpha();
  let primaryKeys = sqlitecretator.getPrimaryKeys(triplesMap.subjectMap);

  let content = "";
  content += "import {GraphQLObjectType,GraphQLList,GraphQLNonNull,GraphQLString,GraphQLInt,GraphQLFloat} from 'graphql'\n"
  content += `import knex from './database'\n`
  
  content += `const ${className} = new GraphQLObjectType({`
  content += `\tdescription: 'An instance of ${className}',\n`
  content += `\tname: '${className}',\n`
  content += `\tsqlTable: '${tmAlpha}',\n`
  content += `\tuniqueKey: '${primaryKeys}',\n`
  content += `\tfields: () => ({\n`
  content += triplesMap.predicateObjectMaps.map(function (predicateObjectMap) {
    /*
    console.log(`predicateObjectMap = ${predicateObjectMap}`)
    console.log(`predicateObjectMap.predicate = ${predicateObjectMap.predicate}`)
    console.log(`predicateObjectMap.objectMap.referenceValue = ${predicateObjectMap.objectMap.referenceValue}`)
    console.log(`predicateObjectMap.objectMap.functionString = ${predicateObjectMap.objectMap.functionString}`)
    console.log(`predicateObjectMap.objectMap.template = ${predicateObjectMap.objectMap.template}`)
    */



    let predicate = predicateObjectMap.predicate;
    let objectMap = predicateObjectMap.objectMap;
    let poString = `\t\t${predicate}:{\n`
    

    if(objectMap.referenceValue) {
      poString += "\t\t\ttype: GraphQLString,\n"
      poString += `\t\t\tsqlColumn: '${objectMap.referenceValue}'`
    } else if(objectMap.functionString) {
      poString += "\t\t\ttype: GraphQLString,\n"
      let functionStringInJoinMaster = objectMap.functionStringAsSQLJoinMonster("table");
      poString += "\t\t\tsqlExpr: table => `" + functionStringInJoinMaster + "`"
    } else if(objectMap.template) {
      poString += "\t\t\ttype: GraphQLString,\n"
      let templateInJoinMaster = objectMap.templateAsJoinMasterDB("table");
      poString += "\t\t\tsqlExpr: table => `" + templateInJoinMaster + "`"
    } else if(objectMap.parentTriplesMap) {
      let parentTriplesMapSubjectMap = objectMap.parentTriplesMap.subjectMap;
      let parentClassName = parentTriplesMapSubjectMap.className;
      additionalImports.push(parentClassName);
      poString += `\t\t\ttype: ${parentClassName},\n`
      let joinCondition = objectMap.joinCondition;
      let child = "${child}." + joinCondition.child.referenceValue;
      let parent = joinCondition.parent.functionStringAsSQLJoinMonster("parent");
      poString += "\t\t\tsqlJoin: (child, parent) => `" + child + " = " + parent + "`"
    }

    poString += "\n\t\t}";
    return poString
  }).join(",\n") + "\n";
  content += `\t})\n`
  content += "})\n"

  content += `export default ${className}\n`
  content += additionalImports.map(function(additionalImport) {
    return `import ${additionalImport} from './${additionalImport}'`
  })

  console.log(`resolver for ${className} = \n${content}`)
  return content;
}
