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
  resolvers += `${class_name}: function(`
  /*
  for(i=0;i<predicates.length;i++){
    resolvers += `${predicates[i]}`
  }
  */
  resolvers += predicates.map(function(predicate) { return "{" + predicate + "}"}).join(",")
  resolvers += `) {\n`
  resolvers += `\tlet sqlSelectFrom = 'SELECT * FROM ${logical_source}'\n`
  resolvers += `\tlet sqlWhere = ""\n`

  for(i=0;i<predicates.length;i++){
    resolvers += "\tif(" + predicates.map(function(predicate) { return predicate + " != null"}).join(" && ") + ") {\n"
    resolvers += `\t\tsqlWhere = sqlWhere + " ${objects[i]} = '"+ ${predicates[i]} +"'"\n`
  }
  resolvers += "\t}\n"
  resolvers += '\tlet sql = "";\n'
  resolvers += '\tif(sqlWhere == "") { sql = sqlSelectFrom } else { sql = sqlSelectFrom + " WHERE " + sqlWhere }\n';
  resolvers += '\tlet data = db.all(sql);\n'
  resolvers += '\tlet allInstances = [];\n'
  resolvers += '\treturn data.then(rows => {\n';
  resolvers += '\t\trows.forEach((row) => {\n';

  resolvers += "\t\t\t" + `let instance = new ${class_name}();\n`
  for(i=0;i<predicates.length;i++){
    resolvers += `\t\t\t\instance.${predicates[i]} = row["${objects[i]}"];\n`
  }  
  resolvers += '\t\t\tallInstances.push(instance);\n'
  resolvers += '\t\t})\n'
  resolvers += '\t\treturn allInstances;\n'
  resolvers += '\t});\n'
  resolvers += `}\n`

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




exports.generate_app = function(db_name){
    var t="from flask import Flask\n"
    t+="from flask_graphql import GraphQLView\n"
    t+="from schema import schema\n"
    t+="from mongoengine import connect\n"
    t+="app = Flask(__name__)\n"
    t+="app.debug = True\n"
    t+="app.add_url_rule('/graphql',view_func=GraphQLView.as_view('graphql',schema=schema, graphiql=True))\n"
    t+="if __name__ == '__main__':\n"
    t+="\tconnect('"+db_name+"', alias='default')\n"
    t+="\tprint('You can access your GraphQL application on http://127.0.0.1:5002/graphql')\n"
    //t+="\tapp.run()\n"
    t+="\tapp.run(port='5002')\n"
    //var content=fs.readFileSync('./example/persona-python-mongodb/app.py');
//    var content=t
//    return content;
    return t;
}

exports.generate_requirements = function(){
    var content=fs.readFileSync('./example/persona-python-mongodb/requirements.txt');
    return content;
}

exports.generate_statup_script = function(){
    var content=fs.readFileSync('./example/persona-python-mongodb/startup.sh');
    return content;
}

