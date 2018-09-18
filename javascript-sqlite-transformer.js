var fs = require('fs');

exports.generateSchema = function(class_name, logical_source, predicate_object) {
  var predicates = Object.keys(predicate_object)
  var objects = Object.values(predicate_object)

  var schema  ="";
  schema += "\ttype Query {" + "\n"
  //schema += `\t${class_name}: [${class_name}]` + "\n"
  schema += `\t\t${class_name}(`
  /*
  for(i=0;i<predicates.length;i++){
    schema += `\t${predicates[i]}: String`
  }
  */
  schema += predicates.map(function(predicate) { return predicate + ":String"}).join(",")
  schema += `): [${class_name}]`  + "\n"
  schema += "\t}"  + "\n"
  
  schema +=  "\n"
  schema += `\ttype ${class_name} {` +  "\n"
  /*
  for(i=0;i<predicates.length;i++){
    schema += `\t\t${predicates[i]}: String` + "\n"
  }
  */
  schema += predicates.map(function(predicate) { return "\t\t" + predicate + ":String\n"})

  schema += "\t}"  + "\n"
  console.log("schema = \n" + schema)
  console.log("\n\n\n")
  return schema;
}

exports.generateModel = function(class_name, logical_source, predicate_object) {
  var predicates = Object.keys(predicate_object)
  var objects = Object.values(predicate_object)

  var model = "";
  model += `class ${class_name} {\n`
  /*
  for(i=0;i<predicates.length;i++){
    model += `\t${predicates[i]}() { return this.${predicates[i]} }\n`
  }
  */
  model += predicates.map(function(predicate) { return "\t" + predicate + "() { return this." + predicate + " }\n"})
  model += `}`
  console.log("model = \n" + model)
  console.log("\n\n\n")
  return model;
}

exports.generateResolvers = function(class_name, logical_source, predicate_object) {
  var predicates = Object.keys(predicate_object)
  var objects = Object.values(predicate_object)

  var resolvers = "";
  resolvers += `\t${class_name}: function(`
  /*
  for(i=0;i<predicates.length;i++){
    resolvers += `${predicates[i]}`
  }
  */
  resolvers += predicates.map(function(predicate) { return "{" + predicate + "}"}).join(",")
  resolvers += `\t) {\n`
  resolvers += `\t\tlet sqlSelectFrom = 'SELECT * FROM ${logical_source}'\n`
  resolvers += `\t\tlet sqlWhere = ""\n`

  for(i=0;i<predicates.length;i++){
    resolvers += "\t\tif(" + predicates.map(function(predicate) { return predicate + " != null"}).join(" && ") + ") {\n"
    resolvers += `\t\t\tsqlWhere = sqlWhere + " ${objects[i]} = '"+ ${predicates[i]} +"'"\n`
  }
  resolvers += "\t\t}\n"
  resolvers += '\t\tlet sql = "";\n'
  resolvers += '\t\tif(sqlWhere == "") { sql = sqlSelectFrom } else { sql = sqlSelectFrom + " WHERE " + sqlWhere }\n';
  resolvers += '\t\tlet data = db.all(sql);\n'
  resolvers += '\t\tlet allInstances = [];\n'
  resolvers += '\t\treturn data.then(rows => {\n';
  resolvers += '\t\t\trows.forEach((row) => {\n';

  resolvers += "\t\t\t\t" + `let instance = new ${class_name}();\n`
  for(i=0;i<predicates.length;i++){
    resolvers += `\t\t\t\t\instance.${predicates[i]} = row["${objects[i]}"];\n`
  }  
  resolvers += '\t\t\t\tallInstances.push(instance);\n'
  resolvers += '\t\t\t})\n'
  resolvers += '\t\t\treturn allInstances;\n'
  resolvers += '\t\t});\n'
  resolvers += `\t}\n`

  console.log("resolvers = \n" + resolvers)
  console.log("\n\n\n")

  return resolvers;
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

exports.generateApp = function(class_name, logical_source, predicate_object, db_name) {
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
  appString += "const port = process.env.PORT || 4001;\n"
  appString += "app.use('/graphql', graphqlHTTP({schema: schema,  rootValue: root,  graphiql: true,}));\n"
  appString += "Promise.resolve().then(() => db.open('" + db_name + "', { Promise }))\n"
  appString += "\t.catch(err => console.error(err.stack))\n"
  appString += "\t.finally(() => app.listen(port));\n"
  appString += "\n"
  appString += "console.log('Running a GraphQL API server at localhost:4001/graphql');\n"
  console.log("appString = \n" + appString)

  return appString;
}

exports.generate_requirements = function(){
    var content=fs.readFileSync('./example/persona-python-mongodb/requirements.txt');
    return content;
}

exports.generate_statup_script = function(){
    var content=fs.readFileSync('./example/persona-python-mongodb/startup.sh');
    return content;
}

