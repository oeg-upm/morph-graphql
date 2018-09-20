var fs = require('fs');

exports.generateSchema = function(class_name, logical_source, predicate_object) {
  var predicates = Object.keys(predicate_object)
  
  var schema  ="";
  schema += "\ttype Query {" + "\n"
  schema += `\t\t${class_name}(`
  schema += predicates.map(function(predicate) { 
    return predicate + ":String"
  }).join(",")
  schema += `): [${class_name}]`  + "\n"
  schema += "\t}"  + "\n"
  
  schema += "\ttype Mutation {" + "\n"
  schema += `\t\tnew${class_name}(`
  schema += predicates.map(function(predicate) { 
    return predicate + ":String"
  }).join(",")
  schema += `): ${class_name}`  + "\n"
  schema += "\t}"  + "\n"

  schema +=  "\n"
  schema += `\ttype ${class_name} {` +  "\n"
  /*
  for(i=0;i<predicates.length;i++){
    schema += `\t\t${predicates[i]}: String` + "\n"
  }
  */
  schema += predicates.map(function(predicate) { 
    return "\t\t" + predicate + ":String"
  }).join("\n") + "\n"

  schema += "\t}"  + "\n"
  //console.log("schema = \n" + schema)
  //console.log("\n\n\n")
  return schema;
}

exports.generateModel = function(class_name, logical_source, predicate_object) {
  var predicates = Object.keys(predicate_object)
  
  var model = "";
  model += `class ${class_name} {\n`
  /*
  for(i=0;i<predicates.length;i++){
    model += `\t${predicates[i]}() { return this.${predicates[i]} }\n`
  }
  */
  model += predicates.map(function(predicate) { 
    return "\t" + predicate + "() { return this." + predicate + " }"
  }).join("\n") + " \n";
  model += `}`
  //console.log("model = \n" + model)
  //console.log("\n\n\n")
  return model;
}

exports.generateResolvers = function(class_name, logical_source, predicate_object_maps) {
  let queryResolversString = this.generateQueryResolvers(class_name, logical_source, predicate_object_maps);
  let mutationResolversString = this.generateMutationResolvers(class_name, logical_source, predicate_object_maps);
  let resolversString = queryResolversString + "\t,\n" + mutationResolversString;

  //console.log("resolversString = \n" + resolversString)
  //console.log("\n\n\n")
  return resolversString;
}

exports.generateQueryResolvers = function(class_name, logical_source, predicate_object_maps) {
  var predicates = Object.keys(predicate_object_maps)
  var objects = Object.values(predicate_object_maps)

  var resolvers = "";
  resolvers += `\t${class_name}: function({`
  /*
  for(i=0;i<predicates.length;i++){
    resolvers += `${predicates[i]}`
  }
  */
  resolvers += predicates.map(function(predicate) { 
    return predicate
  }).join(",")
  resolvers += `}) {\n`
  resolvers += `\t\tlet sqlSelectFrom = 'SELECT * FROM ${logical_source}'\n`
  resolvers += `\t\tlet sqlWhere = []\n`

  /*
  for(i=0;i<predicates.length;i++){
    resolvers += "\t\tif(" + predicates.map(function(predicate) { 
      return predicate + " != null"}
      ).join(" && ") + ") {\n"
    resolvers += `\t\t\tsqlWhere = sqlWhere + " ${objects[i]} = '"+ ${predicates[i]} +"'"\n`
  }
  resolvers += "\t\t}\n"
  */
  
  let equalityString = predicates.map(function(predicate) {
    let object = predicate_object_maps[predicate];
    //console.log("object = " + object)

    return `\t\tif(${predicate} != null) { sqlWhere.push("${object} = '"+ ${predicate} +"'") }`
  }).join("\n")
  //console.log("equalityString = " + equalityString)
  resolvers += equalityString + "\n"

  resolvers += '\t\tlet sql = "";\n'
  resolvers += '\t\tif(sqlWhere.length == 0) { sql = sqlSelectFrom } else { sql = sqlSelectFrom + " WHERE " + sqlWhere.join("AND") }\n';
  resolvers += '\t\tlet data = db.all(sql);\n'
  resolvers += '\t\tlet allInstances = [];\n'
  resolvers += '\t\treturn data.then(rows => {\n';
  resolvers += '\t\t\trows.forEach((row) => {\n';

  resolvers += "\t\t\t\t" + `let instance = new ${class_name}();\n`
  /*
  for(i=0;i<predicates.length;i++){
    resolvers += `\t\t\t\t\instance.${predicates[i]} = row["${objects[i]}"];\n`
  }
  */
  resolvers += predicates.map(function(predicate) { 
    let object = predicate_object_maps[predicate];
    return `\t\t\t\t\instance.${predicate} = row["${object}"];`
  }).join("\n") + "\n";

  resolvers += '\t\t\t\tallInstances.push(instance);\n'
  resolvers += '\t\t\t})\n'
  resolvers += '\t\t\treturn allInstances;\n'
  resolvers += '\t\t});\n'
  resolvers += `\t}\n`

  //console.log("resolvers = \n" + resolvers)
  //console.log("\n\n\n")

  return resolvers;
}

exports.generateMutationResolvers = function(class_name, logical_source, predicate_object_maps) {
  let predicates = Object.keys(predicate_object_maps)
  let objects = Object.values(predicate_object_maps)
  let columnNames = objects.join(",");

  mutationResolverString = ""
  mutationResolverString += `\tnew${class_name}: function({${predicates.join(",")}}) {\n`
  let valuesString = predicates.map(function(predicate) { return "'${" + predicate + "}'"}).join(",")
  //console.log("valuesString = " + valuesString)

  let sqlString = "`INSERT INTO " + logical_source + "(" + columnNames +") VALUES(" + valuesString +")`"
  //console.log("sqlString = " + sqlString)

  mutationResolverString += `\t\tlet sqlInsert = ${sqlString}\n`;
  mutationResolverString += `\t\tlet status = db.run(sqlInsert).then(dbStatus => { return dbStatus });\n`

  
  let newInstanceString = predicates.map(function(predicate) {
    return `\t\tnewInstance.${predicate} = ${predicate}`
  }).join("\n")
  mutationResolverString += `\t\tlet newInstance = new ${class_name}()\n`;
  mutationResolverString += newInstanceString + "\n";
  mutationResolverString += `\t\treturn newInstance\n`;
  mutationResolverString += `\t}\n`
  return mutationResolverString;
}


exports.transform = function(class_name, logical_source, predicate_object) {
  var predicates = Object.keys(predicate_object)
  var objects = Object.values(predicate_object)

  var schema = this.generateSchema(class_name, logical_source, predicate_object);
  //console.log("schema = \n" + schema)

  var model = this.generateModel(class_name, logical_source, predicate_object);
  //console.log("model = \n" + model)

  var resolvers = this.generateResolvers(class_name, logical_source, predicate_object);
  //console.log("resolvers = \n" + resolvers)
}

exports.toLowerCaseFirstChar = function(str) {
    return str.substr( 0, 1 ).toLowerCase() + str.substr( 1 );
}

exports.generateApp = function(class_name, logical_source, predicate_object, 
  db_name, port_no) {
  var appString = "";
  var schemaString = this.generateSchema(class_name, logical_source, predicate_object)
  var modelString = this.generateModel(class_name, logical_source, predicate_object)
  var resolversString = this.generateResolvers(class_name, logical_source, predicate_object)

  appString += "const db = require('sqlite');\n"
  appString += "const express = require('express');\n"
  appString += "const graphqlHTTP = require('express-graphql');\n"
  appString += "const Promise = require('bluebird');\n"
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

exports.generate_requirements = function(){
    var content=fs.readFileSync('./transformers/javascript/sqlite/package.json');
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

