var fs = require('fs');

exports.generate_schema_header = function(logical_source) {
    var db_model_as_name = logical_source+"Model"
    var t="import graphene\n"
    t+="from graphene_mongo import MongoengineObjectType\n"
    t+="from models import "+logical_source+" as "+db_model_as_name+"\n"
    return t
}

exports.generate_schema_class = function(class_name, logical_source, predicate_object){
    var db_model_as_name = logical_source+"Model"
    var v_att,i,t = "class "+class_name+"(graphene.ObjectType):\n"
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
    return t
}

exports.generate_schema_body = function(class_name, logical_source){
    var db_model_as_name = logical_source+"Model"
    var t=""
    t+= "class Query(graphene.ObjectType):\n"
    t+= "\t"+class_name+" = graphene.List("+class_name+")\n"
    t+= "\tdef resolve_"+class_name+"(self, info):\n"
    t+= "\t\treturn list("+db_model_as_name+".objects.all())\n"
    t+= "schema = graphene.Schema(query=Query)\n"
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
    schema += this.generate_schema_class(class_name, logical_source, predicate_object)
    schema += this.generate_schema_body(class_name, logical_source)
    return schema 
  }
