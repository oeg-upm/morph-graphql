var fs = require('fs');

exports.generate_schema_header = function(logical_source) {
    var db_model_as_name = logical_source+"Model"
    var t="import graphene\n"
    t+="from graphene_mongo import MongoengineObjectType\n"
    t+="from models import "+logical_source+" as "+db_model_as_name+"\n"
    t+="def get_mapped_kwargs(mapping, vkwargs):\n"
    t+="\toriginal_kwargs = {}\n"
    t+="\tfor kw in vkwargs.keys():\n"
    t+="\t\toriginal_kwargs[mapping[kw]] = vkwargs[kw]\n"
    t+="\treturn original_kwargs\n"
    console.log("Generating schema header\n\n\n\n\n\n")
    return t
}

exports.generate_schema_class = function(class_name, logical_source, predicate_object){
    var db_model_as_name = logical_source+"Model"
    var v_att,i,t = "\nclass "+class_name+"(graphene.ObjectType):\n"
    var predicates = Object.keys(predicate_object)
    for(i=0;i<predicates.length;i++){
        v_att = predicates[i]
        t+="\t"+v_att+" = graphene.String()\n"
    }
    for(i=0;i<predicates.length;i++){
        v_att = predicates[i]
        a_att = predicate_object[predicates[i]]
        t+="\tdef resolve_"+v_att+"(self, info):\n"
        t+="\t\treturn "+db_model_as_name+".objects.get(id=self.id)."+a_att+"\n"
    }
    
    var att_mapping = class_name+"_mapping"
    var t_mapping = att_mapping + " = {\n"
    for(i=0;i<predicates.length;i++){
        v_att = predicates[i]
        a_att = predicate_object[predicates[i]]
        t_mapping+= "'"+v_att+"': '"+a_att+"',\n"
    }
    t_mapping+="}\n\n"
    return t_mapping+t
}

exports.generate_schema_body = function(class_name, logical_source, predicate_object){
    var db_model_as_name = logical_source+"Model"
    var i, att_mapping = class_name+"_mapping"
    var predicates = Object.keys(predicate_object)
    var filter_fields=""
    for(i=0;i<predicates.length;i++){
        v_att = predicates[i]
        filter_fields+= "," + v_att + "=graphene.String()"
    }
    var t=""
    t+= "class Query(graphene.ObjectType):\n"
    t+= "\t"+class_name+" = graphene.List("+class_name+filter_fields+")\n"
    t+= "\tdef resolve_"+class_name+"(self, info, **kwargs):\n"
    t+= "\t\toriginal_kwargs = get_mapped_kwargs("+att_mapping+", kwargs)\n"
    t+= "\t\treturn list("+db_model_as_name+".objects.filter(**original_kwargs))\n"

    return t
}

exports.toLowerCaseFirstChar = function(str) {
    return str.substr( 0, 1 ).toLowerCase() + str.substr( 1 );
}

exports.generate_mutation = function(class_name, logical_source, predicate_object){
    var att_mapping = class_name+"_mapping"
    var t="\n"
    t+= "class Create" + class_name +"(graphene.Mutation):\n"
    t+= "\tclass Arguments:\n"
    
    var predicates = Object.keys(predicate_object)
    //var objects = Object.values(predicate_object)
//    console.log("objects = " + objects)
    for(i=0;i<predicates.length;i++){
        t += "\t\t" +predicates[i] + "= graphene.String(required=True)\n"
    }
    t+= "\n"

    t+= "\t" + this.toLowerCaseFirstChar(class_name) + " = graphene.Field("+ class_name +")\n"
    t+= "\n"
    t+= "\tdef mutate(self, info, **kwargs):\n"
    t+= "\t\toriginal_kwargs = get_mapped_kwargs("+att_mapping+", kwargs)\n"
    t+= "\t\t" + this.toLowerCaseFirstChar(class_name) + " = " + logical_source + "Model(**original_kwargs)\n"
    t+= "\t\t" + this.toLowerCaseFirstChar(class_name) + ".save()\n"
    t+= "\t\treturn Create" + class_name + "(" + this.toLowerCaseFirstChar(class_name) + "=" + this.toLowerCaseFirstChar(class_name) + ")\n"
    t+= "\n"

    t+= "class Mutation(graphene.ObjectType):\n"
    t+= "\tcreate_" + this.toLowerCaseFirstChar(class_name) + " = Create" + class_name + ".Field()\n"

   return t
}


exports.createSchemaPythonMongodb = function(className){   
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

  exports.generateSchema = function(class_name, logical_source, predicate_object) {
    var schema =""
    schema += this.generate_schema_header(logical_source)
    schema += "\n"
    schema += this.generate_schema_class(class_name, logical_source, predicate_object)
    schema += "\n"
    schema += this.generate_schema_body(class_name, logical_source, predicate_object)
    schema += "\n"
    schema += this.generate_mutation(class_name, logical_source, predicate_object)
    schema += "\n"
    schema += "schema = graphene.Schema(query=Query, mutation=Mutation)\n"
    return schema
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
    t+="\tapp.run()\n"
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

exports.generateModel = function(class_name, logical_source, predicate_object) {
      var model = ""
      model += "from mongoengine import Document\n"
      model += "from mongoengine.fields import StringField\n"
      model += "\n\n"
      model += "class " + logical_source + "(Document):\n"
      model += "\tmeta = {'collection': '"+ logical_source +"'}\n"
      var objects = Object.values(predicate_object)

      for(i=0;i<objects.length;i++){
        model += "\t" + objects[i] + "= StringField(required=True)"
      }
      return model
}

