const uuid = require('uuid');

class RMLParser {
    constructor(json) {
        this.json = json;
    }

    getTriplesMapsIds() {
        let triplesMapsIds = [];

        for(var i=0;i<this.json["@graph"].length;i++){
            let item = this.json["@graph"][i];
            if("rml:logicalSource" in item){
                let triplesMapId = item["@id"];
                triplesMapsIds.push(triplesMapId);
            }
        }
        //console.log(`triplesMapsIds = ${triplesMapsIds}`);
        return triplesMapsIds;
    }

    getLogicalSourceId(triplesMapId) {
        var logicalSourceId = null;
        for(var i=0;i<this.json["@graph"].length;i++) {
            let item = this.json["@graph"][i]
            if(item["@id"]==triplesMapId){
                logicalSourceId = item['rml:logicalSource']['@id']
                break
            }
        }

        //console.log(`logicalSourceId = ${logicalSourceId}`);
        return logicalSourceId
    }

    buildLogicalSource(logicalSourceId) {
        let logicalSource = null;
        for(var i=0;i<this.json["@graph"].length;i++) {
            let item = this.json["@graph"][i]
            if(item["@id"]==logicalSourceId){
                logicalSource = item['rml:source']
                break
            }
        }

        //console.log(`logicalSource = ${logicalSource}`);
        return logicalSource        
    }

    getSubjectMapId(triplesMapId) {
        let subjectMapId = null;

        for(var i=0;i<this.json["@graph"].length;i++){
            let item = this.json["@graph"][i];
            if(item["@id"]==triplesMapId){
                subjectMapId = item["rr:subjectMap"]["@id"];
                break
            }
        }
        //console.log(`subjectMapId = ${subjectMapId}`);
        return subjectMapId;
    }

    buildSubjectMap(subjectMapId) {
        var subjectMap = new SubjectMap();
        subjectMap.parseFromJson(this.json, subjectMapId)
        for(var i=0;i<this.json["@graph"].length;i++) {
            let item = this.json["@graph"][i]
            if(item["@id"]==subjectMapId){
                let classNameWithNamespace = item["rr:class"]["@id"];
                let classNameWithoutNamespace = classNameWithNamespace.split(":")[1];
                subjectMap.className = classNameWithoutNamespace;
                break;
            }
        }
    
        //console.log(`\tsubjectMap.referenceValue = ${subjectMap.referenceValue}`);
        //console.log(`\tsubjectMap.template = ${subjectMap.template}`);
        return subjectMap        
    }

    getPredicateObjectMapsIds(triplesMapId) {
        let predicateObjectMapsIds = [];
        for(let i=0;i<this.json["@graph"].length;i++){
            let item = this.json["@graph"][i];
            if(item["@id"] == triplesMapId && "rr:predicateObjectMap" in item){
                let predicateObjectMaps = item["rr:predicateObjectMap"];
                if(Array.isArray(predicateObjectMaps)) {
                    predicateObjectMaps.forEach(function(predicateObjectMap) {
                        predicateObjectMapsIds.push(predicateObjectMap["@id"])
                    })
                } else {
                    predicateObjectMapsIds.push(predicateObjectMaps["@id"])
                }
    
    
            }
        }
        return predicateObjectMapsIds
    }

    buildTriplesMap(triplesMapId) {
        //console.log(`triplesMapId = ${triplesMapId}`);
        
        let logicalSourceId = this.getLogicalSourceId(triplesMapId);

        let logicalSource = this.buildLogicalSource(logicalSourceId);
        //console.log(`\tlogicalSource = ${logicalSource}`);

        let subjectMapId = this.getSubjectMapId(triplesMapId);

        let subjectMap = this.buildSubjectMap(subjectMapId);
        //console.log(`\tsubjectMap.className = ${subjectMap.className}`);

        let predicateObjectMapsIds = this.getPredicateObjectMapsIds(triplesMapId)

        let predicateObjectMaps = []
        let subjectMapAsPredicateObjectMapIdentifier = new PredicateObjectMap();
        subjectMapAsPredicateObjectMapIdentifier.predicate = "identifier";
        subjectMapAsPredicateObjectMapIdentifier.objectMap = subjectMap;
        predicateObjectMaps.push(subjectMapAsPredicateObjectMapIdentifier)

        for (var i=0; i < predicateObjectMapsIds.length; i++) {
            var predicateObjectMapId = predicateObjectMapsIds[i];
            //console.log(`\tpredicateObjectMapId = ${predicateObjectMapId}`)

            let predicateObjectMap = this.buildPredicateObjectMap(predicateObjectMapId);
            //console.log(`\t\tpredicateObjectMap.predicate = ${predicateObjectMap.predicate}`)
            //console.log(`\t\tpredicateObjectMap.objectMap = ${predicateObjectMap.objectMap}`)
            if(predicateObjectMap.objectMap.parentTriplesMap) {
                //console.log(`\t\tpredicateObjectMap.objectMap.parentTriplesMap = ${predicateObjectMap.objectMap.parentTriplesMap}`)
            }
            
            if(predicateObjectMap.objectMap.joinCondition) {

                console.log(`\t\tpredicateObjectMap.objectMap.joinCondition = ${predicateObjectMap.objectMap.joinCondition}`)
                console.log(`\t\tpredicateObjectMap.objectMap.joinCondition.child.referenceValue = ${predicateObjectMap.objectMap.joinCondition.child.referenceValue}`)
                console.log(`\t\tpredicateObjectMap.objectMap.joinCondition.child.functionString = ${predicateObjectMap.objectMap.joinCondition.child.functionString}`)
                console.log(`\t\tpredicateObjectMap.objectMap.joinCondition.parent.referenceValue = ${predicateObjectMap.objectMap.joinCondition.parent.referenceValue}`)
                console.log(`\t\tpredicateObjectMap.objectMap.joinCondition.parent.functionString = ${predicateObjectMap.objectMap.joinCondition.parent.functionString}`)
            }

            predicateObjectMaps.push(predicateObjectMap)
        }

        let triplesMap = new TriplesMap(logicalSource, subjectMap, predicateObjectMaps);
        return triplesMap;

    }



    buildPredicateObjectMap(predicateObjectMapId) {
        let predicate = this.buildPredicate(predicateObjectMapId);
        let objectId = this.getObjectMapId(predicateObjectMapId);
        let objectMap = this.buildObjectMap(objectId);
        let predicateObjectMap = new PredicateObjectMap(predicate, objectMap);
        return predicateObjectMap;
    }

    buildPredicate(predicateObjectMapId) {
        let predicate = null;

        for(var i=0;i<this.json["@graph"].length;i++){
            let item = this.json["@graph"][i];
            if(item["@id"]==predicateObjectMapId){
                let predicateWithNamespace = item["rr:predicate"]["@id"];;
                predicate = predicateWithNamespace.split(":")[1];
                break
            }
        }
        //console.log(`subjectMapId = ${subjectMapId}`);
        return predicate;
    }

    getObjectMapId(predicateObjectMapId) {
        let objectMapId = null;
        for(var i=0;i<this.json["@graph"].length;i++) {
            let item = this.json["@graph"][i]
            if(item["@id"]==predicateObjectMapId){
                objectMapId = item['rr:objectMap']['@id']
                break
            }
        }

        //console.log(`objectMapId = ${objectMapId}`);
        return objectMapId
    }



    buildObjectMap(objectMapId) {
        let objectMap = new ObjectMap();
        objectMap.parseFromJson(this.json, objectMapId);
        return objectMap;
    }

    buildMappingDocument() {
        let triplesMapsIds = this.getTriplesMapsIds();
        let triplesMaps = [];

        for(var i=0; i<triplesMapsIds.length; i++) {
            let triplesMapId = triplesMapsIds[i];
            let triplesMap = this.buildTriplesMap(triplesMapId);
            triplesMaps.push(triplesMap)
        }

        let mappingDocument = new MappingDocument(triplesMaps);
        return mappingDocument;
    }
}

class MappingDocument {
    constructor(triplesMaps) {
        this.triplesMaps = triplesMaps;

    }
}

class TermMap {
    //hashCode = "";

    getConstantValue() { return this.constantValue }
    getColumnName() { return this.columnName }
    getTemplate() { return this.template }
    getReferenceValue() { return this.referenceValue }
    getFunctionString() { return this.functionString }
    getDatatype () { return this.datatype}

    getHashCode() {
        if(this.hashCode == undefined) {
            this.hashCode = "tm" + uuid.v4().substring(0,8);
        }
        return this.hashCode
    }

    beta() {
        let betaValue = "";
        if(this.referenceValue) {
            betaValue = this.referenceValue
        } else if(this.functionString) {
            betaValue = this.functionString;
        } else if(this.template) {
            betaValue = this.templateToSQL();
        } else {
            betaValue = null
        }

        return betaValue;
    }

    genPRSQL() {
        let prSQL = null;
        let betaValue = this.beta();
        let hashCode = this.getHashCode();

        if(betaValue != null ) {
            if(this.referenceValue) {
                prSQL = `${betaValue} AS ${betaValue}`
            } else {
                prSQL = `${betaValue} AS ${hashCode}`
            }
        }
        return prSQL;
    }

    parseFromJson(json, termMapId) {

        for(let i=0;i<json["@graph"].length;i++) {
            let item = json["@graph"][i]
            if(item["@id"]==termMapId){
                this.referenceValue = item['rml:reference'];
                this.template = item['rr:template'];
                this.functionString = item['rmlc:functions'];
                this.datatype = 'String';
                if(item['rr:datatype']){
                    var xsdType = item['rr:datatype']['@id'].split(':')[1];
                     switch (xsdType) { //ToDo how to include all possible datatypes? xsd:decimal, etc.
                         case 'integer':
                         this.datatype = 'Int';
                             break;
                         case 'decimal':
                         this.datatype = 'Float';
                             break;
                         case 'float':
                         this.datatype = 'Float';
                             break;
                         case 'double':
                         this.datatype = 'Float';
                             break;
                         case 'boolean':
                         this.datatype = 'Boolean';
                             break;
                    }
                }
                else {
                    this.datatype = 'String';
                }

                if(item['rr:parentTriplesMap']) {
                    this.parentTriplesMap = item['rr:parentTriplesMap']["@id"];
                }

                if(item['rr:joinCondition']) {
                    let joinConditionId = item['rr:joinCondition']["@id"];
                    this.joinCondition = this.buildJoinCondition(json, joinConditionId)
                }

                break;
            }
        }


        //console.log("termMap.referenceValue: " + termMap.referenceValue)
        //console.log("termMap.template: " + termMap.template)
        //console.log("termMap.functionString: " + termMap.functionString)
    }

    buildJoinCondition(json, joinConditionId) {
        let joinCondition = new JoinCondition();;

        for(var i=0;i<json["@graph"].length;i++){
            let item = json["@graph"][i];
            let itemId = item["@id"];
            //console.log(`itemId = ${itemId}`);
            //console.log(`\tjoinCondition = ${joinCondition}`);
            if(item["@id"]==joinConditionId){
                let childId = item["rmlc:child"]["@id"];
                //console.log(`childId = ${childId}`);
                let child = new TermMap();
                child.parseFromJson(json, childId);
                //console.log(`child = ${child}`);
                let parentId = item["rmlc:parent"]["@id"];
                //console.log(`parentId = ${parentId}`);
                let parent = new TermMap();
                parent.parseFromJson(json, parentId);
                //console.log(`parent = ${parent}`);
                joinCondition.child = child;
                joinCondition.parent = parent;
                break
            }
        }
        //console.log(`joinCondition = ${joinCondition}`);
        return joinCondition;
    }

    templateToSQL() {
        let templateInSQL = this.template;
        templateInSQL = `'${templateInSQL}'`
        templateInSQL = templateInSQL.split("{").join("' || ");
        templateInSQL = templateInSQL.split("}").join(" || '");
        //console.log("templateInSQL =  " + templateInSQL)
        return templateInSQL;
    }

    templateAsJoinMasterDB(prefix) {
        let templateInSQL = this.template;
        templateInSQL = `${templateInSQL}`
        templateInSQL = "'" + templateInSQL + "'"
        templateInSQL = templateInSQL.split("{").join("{" + prefix + ".")
        templateInSQL = templateInSQL.split("{").join("' || {");
        templateInSQL = templateInSQL.split("}").join("} || '");
        templateInSQL = templateInSQL.split("}").join("");
        templateInSQL = templateInSQL.split("{").join("");
        templateInSQL = templateInSQL.split(prefix).join("${" + prefix + "}");
        return templateInSQL;
    }

    templateAsJoinMonsterJS(prefix) {
        console.log("this.template =  " + this.template)
        let sqlJoinMonster = this.template;
        sqlJoinMonster = sqlJoinMonster.split("{").join("${" + prefix + ".");
        //sqlJoinMonster = sqlJoinMonster.split("}").join("");
        //sqlJoinMonster = sqlJoinMonster.split(prefix).join(prefix + "}");        
        console.log("sqlJoinMonster =  " + sqlJoinMonster)
        return sqlJoinMonster;
    }

    functionStringAsSQLJoinMonster(prefix) {
        console.log("this.functionString =  " + this.functionString)
        let sqlJoinMonster = this.functionString;
        sqlJoinMonster = sqlJoinMonster.split("{").join("${" + prefix + ".");
        sqlJoinMonster = sqlJoinMonster.split("}").join("");
        sqlJoinMonster = sqlJoinMonster.split(prefix).join(prefix + "}");
        console.log("sqlJoinMonster =  " + sqlJoinMonster)
        return sqlJoinMonster;
    }

}

class SubjectMap extends TermMap {
    getClassName() { return this.className; }

}

class ObjectMap extends TermMap {
    getTermMap() { return this.termMap; }
    getRefObjectMap() { return this.refObjectMap; }
}

class RefObjectMap {
    getParentTriplesMap() { return this.parentTriplesMap; }
    getJoinCondition() { return this.joinCondition; }
}

class JoinCondition {
    getChild() { return this.child; }
    getParent() { return this.parent; }
}

class PredicateObjectMap {
    constructor(predicate, objectMap) {
        this.predicate = predicate;
        this.objectMap = objectMap;
    }

  genCondSQL() {
    let predicate = this.predicate
    let objectMap = this.objectMap;
    let condSQL = null;
    if(objectMap.referenceValue) {
      if(objectMap.datatype !== 'String'){
          condSQL = `"${objectMap.referenceValue} = "+ ${predicate}`
      }
      else {
          condSQL = `"${objectMap.referenceValue} = '"+ ${predicate} +"'"`
      }

    } else if(objectMap.functionString || objectMap.template) {
      let omHash = objectMap.getHashCode();
      condSQL = `"${omHash} = '"+ ${predicate} +"'"`
    } else {
        condSQL = null
    }

    //console.log("condSQL = " + condSQL)
    return condSQL
  }
}

class TriplesMap {
    constructor(logicalSource, subjectMap, predicateObjectMaps) {
        this.logicalSource = logicalSource;
        this.subjectMap = subjectMap;
        this.predicateObjectMaps = predicateObjectMaps;
    }

    getNumberOfPredicateObjectMaps() {
        return this.predicateObjectMaps.length;
    }

    getLogicalSource() { return this.logicalSource; }
    getSubjectMap() { return this.subjectMap; }
    getPredicateObjectMaps() { return this.predicateObjectMaps; }

    getAlpha() { 
        if(this.logicalSource.endsWith(".csv")) {
            return this.logicalSource.split(".csv")[0].split("/")[this.logicalSource.split(".csv")[0].split("/").length-1];
        } else {
            return this.logicalSource; 
        }
        
    }

    genPRSQL() {
        let objectMaps = this.predicateObjectMaps.map(function(predicateObjectMap) {
            return predicateObjectMap.objectMap;
        });

        let prSQLTriplesMap = objectMaps.reduce(function(filtered, objectMap) {
            let prSQLObjectMap = objectMap.genPRSQL();
            if(prSQLObjectMap != null) {
              filtered.push(prSQLObjectMap)
            }
        

            return filtered
          }, []);

          //console.log(`prSQLTriplesMap = ${prSQLTriplesMap}`);
          return prSQLTriplesMap;
    }

    genCondSQL() {
        let condSQLTriplesMap = this.predicateObjectMaps.reduce(function(filtered, predicateObjectMap) {
            let predicate = predicateObjectMap.predicate;
            let condSQL = predicateObjectMap.genCondSQL();
            if(condSQL != null) {
              filtered.push(`\t\tif(${predicate} != null) { sqlWhere.push(${condSQL}) }`)
            }
            return filtered;
        }, []);
        //console.log(`condSQLTriplesMap = ${condSQLTriplesMap}`);
        return condSQLTriplesMap;
    }

    genQueryArguments(flag) {
        let queryArguments = this.predicateObjectMaps.reduce(function(filtered, predicateObjectMap) {
            let predicate = predicateObjectMap.predicate;
            let objectMap = predicateObjectMap.objectMap;
        
            if(objectMap.referenceValue || objectMap.functionString || objectMap.template) {
                if(flag)
                    filtered.push(predicate+':'+objectMap.datatype);
                else
                    filtered.push(predicate);
            }

            return filtered
        }, []);
        //console.log(`queryArguments = ${queryArguments}`)

        return queryArguments;
    }

    genMutationArguments(flag) {
        //console.log(`predicateObjectMaps.length = ${this.predicateObjectMaps.length} ...`) 

        let mutationArguments = this.predicateObjectMaps.reduce(function(filtered, predicateObjectMap) {
            let predicate = predicateObjectMap.predicate;
            //console.log(`predicate = ${predicate}`)
            let objectMap = predicateObjectMap.objectMap;
            if(objectMap.referenceValue) {
                if(flag)
                    filtered.push(predicate+':'+objectMap.datatype);
                else
                    filtered.push(predicate);
            }
            return filtered
          }, []);

        //console.log(`mutationArguments = ${mutationArguments}`)
        return mutationArguments;        
    }

}

//input: original json and modified json
//output: classnamne:String ie Person
exports.get_class_name = function (j){
    var model_name
    for(i=0;i<j["@graph"].length;i++){
        item = j["@graph"][i];
        if("rr:class" in item){
            con_arr = item["rr:class"]["@id"].split(":")
            model_name =  con_arr[con_arr.length-1]
            //console.log("model name: "+model_name)
            break
        }
    }
    return model_name
}

exports.getSubjectMapId = function(json){
    var subjectMapId = null;

    for(i=0;i<json["@graph"].length;i++) {
        item = json["@graph"][i]
        if("rr:subjectMap" in item){
            subjectMapId = item["rr:subjectMap"]["@id"]
            break
        }
    }

    return subjectMapId;
}

exports.getSubjectMapRef = function(json, subjectMapId){
    //console.log("subjectMapId = "+subjectMapId)

    var subjectMapRef = null;

    for(i=0;i<json["@graph"].length;i++) {
        item = json["@graph"][i]

        if(item["@id"]==subjectMapId){
            subjectMapRef = item['rml:reference']
            break;
        }
    }

    return subjectMapRef
}

exports.getSubjectMap = function(json, subjectMapId){

    // var subjectMap = this.getTermMap(json, subjectMapId)
    // for(i=0;i<json["@graph"].length;i++) {
    //     item = json["@graph"][i]
    //
    //     if(item["@id"]==subjectMapId){
    //         subjectMap.referenceValue = item['rml:reference'];
    //         subjectMap.template = item['rr:template'];
    //         break;
    //     }
    // }

    var subjectMap = new SubjectMap();
    subjectMap.parseFromJson(json, subjectMapId)
    subjectMap.className = this.get_class_name(json)

    return subjectMap
}

exports.getTermMap = function(json, termMapId){
    var termMap = new TermMap();

    for(i=0;i<json["@graph"].length;i++) {
        item = json["@graph"][i]
        if(item["@id"]==termMapId){
            termMap.referenceValue = item['rml:reference'];
            termMap.template = item['rr:template'];
            termMap.functionString = item['rmlc:functions'];
            if(item['rr:datatype']){
               var xsdType = item['rr:datatype']['@id'].split(':')[1];
                switch (xsdType) { //ToDo how to include all possible datatypes? xsd:decimal, etc.
                    case 'integer':
                        termMap.datatype = 'Int';
                        break;
                    case 'decimal':
                        termMap.datatype = 'Float';
                        break;
                    case 'float':
                        termMap.datatype = 'Float';
                        break;
                    case 'double':
                        termMap.datatype = 'Float';
                        break;
                    case 'boolean':
                        termMap.datatype = 'Boolean';
                        break;
                }
            }
            else {
                termMap.datatype = 'String';
            }

            break;
        }
    }

    //console.log("termMap.referenceValue: " + termMap.referenceValue)
    //console.log("termMap.template: " + termMap.template)
    //console.log("termMap.functionString: " + termMap.functionString)
    return termMap
}

//input: original json and modified json
//output: tablename:String ie personas
exports.get_logical_source = function (j){
    var logical_source
    for(i=0;i<j["@graph"].length;i++){
        item = j["@graph"][i];
        if("rml:source" in item){
            logical_source =  item["rml:source"]
            //console.log("logical_source: "+logical_source)
            break
        }
    }
    return logical_source
}

//input: original json and modified json
//output: List of PredicateObjectMap id
exports.get_predicate_object_map_list = function(j){
    var pred_obj_map_ids = []
    for(i=0;i<j["@graph"].length;i++){
        item = j["@graph"][i];
        if("rr:predicateObjectMap" in item){
            let predicateObjectMaps = item["rr:predicateObjectMap"];
            //console.log(`predicateObjectMaps = ${predicateObjectMaps}`)
            if(Array.isArray(predicateObjectMaps)) {
                predicateObjectMaps.forEach(function(predicateObjectMap) {
                    pred_obj_map_ids.push(predicateObjectMap["@id"])
                })
            } else {
                pred_obj_map_ids.push(predicateObjectMaps["@id"])
            }


        }
    }
    return pred_obj_map_ids
}

//input: original json and modified json and an id of PredicateObjectMap
//output: predicate name (ie name)
exports.get_predicate = function(json, predicate_object_map_id){
    var i,something
    for(i=0;i<json["@graph"].length;i++) {
        item = json["@graph"][i]
        if(item["@id"]==predicate_object_map_id){
            something = item['rr:predicate']['@id']
        }
    }
    return something.split(":")[1]
}

//input: original json and modified json and an id of PredicateObjectMap
//output: object column  (ie nombre)
exports.get_object = function(json, predicate_object_map_id){
    var i,objectMapIdm, omReference
    for(i=0;i<json["@graph"].length;i++) {
        item = json["@graph"][i]
        if(item["@id"]==predicate_object_map_id){
            objectMapId = item['rr:objectMap']['@id']
        }
    }

    let objectMap = new TermMap();

    for(i=0;i<json["@graph"].length;i++) {
        item = json["@graph"][i]
        if(item["@id"]==objectMapId){
            omReference = item['rml:reference']
            objectMap.referenceValue = item['rml:reference'];
            objectMap.template = item['rr:template'];
        }
    }

    return omReference
}

//input: original json and modified json and an id of PredicateObjectMap
//output: object map
exports.getObjectMap = function(json, predicate_object_map_id){
    var i,objectMapIdm, omReference
    for(i=0;i<json["@graph"].length;i++) {
        item = json["@graph"][i]
        if(item["@id"]==predicate_object_map_id){
            objectMapId = item['rr:objectMap']['@id']
        }
    }

    let objectMap = this.getTermMap(json, objectMapId)

    //console.log("objectMap.referenceValue: " + objectMap.referenceValue)
    //console.log("objectMap.template: " + objectMap.template)
    //console.log("objectMap.functionString: " + objectMap.functionString)
    return objectMap
}


exports.get_jsonld_from_mapping = function(mapping_url) {
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://rdf-translator.appspot.com/convert/n3/json-ld/"+mapping_url, false);
    xhttp.send();
    //console.log('reply: ');
    var j = JSON.parse(xhttp.responseText);
    let rmlParser = new RMLParser(j);
    let mappingDocument = rmlParser.buildMappingDocument();
    //console.log(`mappingDocument = ${mappingDocument}`);

    var i;
    var item, new_item
    var k, keys
    //var subjectMap_id
    //var class_name
    var graph
    var res_data = {}
    //var className = get_class_name(j)
    var className = this.get_class_name(j)
    res_data["class_name"] = className
    //console.log('className = ' + className)

    let smId = this.getSubjectMapId(j);
    let subjectMapRef = this.getSubjectMapRef(j, smId)
    let subjectMap = this.getSubjectMap(j, smId)


    var listOfPredicateObject =  this.get_predicate_object_map_list(j)
    //console.log('listOfPredicateObject = ' + listOfPredicateObject)

    var logicalSource = this.get_logical_source(j)
    res_data["logical_source"] = logicalSource
    //console.log('logicalSource = ' + logicalSource)
    var pairsOfPredicateObject = {}
    pairsOfPredicateObject["identifier"] = subjectMapRef

    var pairsOfPredicateObjectMap = {}
    pairsOfPredicateObjectMap["identifier"] = subjectMap

    predicateObjectMaps = [];
    let subjectMapAsPredicateObjectMapIdentifier = new PredicateObjectMap();
    subjectMapAsPredicateObjectMapIdentifier.predicate = "identifier";
    subjectMapAsPredicateObjectMapIdentifier.objectMap = subjectMap;
    predicateObjectMaps.push(subjectMapAsPredicateObjectMapIdentifier)

    for(i=0;i<listOfPredicateObject.length;i++){
        predicateObjectMapId = listOfPredicateObject[i];
        //console.log('\tpredicateObjectMap = ' + predicateObjectMap)

        predicate = this.get_predicate(j, predicateObjectMapId)
        //console.log('predicate = ' + predicate)

        object = this.get_object(j, predicateObjectMapId)
        //console.log('object = ' + object)
        pairsOfPredicateObject[predicate] = object

        objectMap = this.getObjectMap(j, predicateObjectMapId);
        pairsOfPredicateObjectMap[predicate] = objectMap

        let predicateObjectMap = new PredicateObjectMap();
        predicateObjectMap.predicate = predicate;
        predicateObjectMap.objectMap = objectMap;
        predicateObjectMaps.push(predicateObjectMap);
    }
    //console.log('pairsOfPredicateObject = ' + pairsOfPredicateObject)


    //console.log('pairsOfPredicateObject = ' + pairsOfPredicateObject)

    res_data["predicate_object"] = pairsOfPredicateObject
    res_data["predicate_objectmap"] = pairsOfPredicateObjectMap
    res_data["predicateObjectMaps"] = predicateObjectMaps

    //console.log('pairsOfPredicateObject = ' + JSON.stringify(pairsOfPredicateObject))
    //console.log('res_data: '+JSON.stringify(res_data))

    let triplesMap = new TriplesMap(logicalSource, subjectMap, predicateObjectMaps);
    res_data["triplesMap"] = triplesMap
    res_data["mappingDocument"] = mappingDocument


    return res_data
}

exports.getClassNameFromMapping = function(mappingURL){
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://rdf-translator.appspot.com/convert/n3/json-ld/" + mappingURL, false);
    xhttp.send();
    //console.log('reply: ');
    //console.log(xhttp.responseText);
    var j = JSON.parse(xhttp.responseText);
    var i;
    var item
    for(i=0;i<j["@graph"].length;i++){
        item = j["@graph"][i];
        if("rr:class" in item){
            con_arr = item["rr:class"]["@id"].split(":")
            model_name =  con_arr[con_arr.length-1]
            //console.log("model name: "+model_name)
        }
        else{

        }
    }

    return model_name
  }
