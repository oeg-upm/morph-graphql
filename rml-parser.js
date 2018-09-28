const uuid = require('uuid');

class TermMap {
    //hashCode = "";

    getConstantValue() { return this.constantValue }
    getColumnName() { return this.columnName }
    getTemplate() { return this.template }
    getReferenceValue() { return this.referenceValue }
    getFunctionString() { return this.functionString }
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

        for(i=0;i<json["@graph"].length;i++) {
            item = json["@graph"][i]
            if(item["@id"]==termMapId){
                this.referenceValue = item['rml:reference'];
                this.template = item['rr:template'];
                this.functionString = item['rmlc:functions'];

                break;
            }
        }

        //console.log("termMap.referenceValue: " + termMap.referenceValue)
        //console.log("termMap.template: " + termMap.template)
        //console.log("termMap.functionString: " + termMap.functionString)
    }

}

class SubjectMap extends TermMap {

}

class PredicateObjectMap {
  genCondSQL() {
    let predicate = this.predicate
    let objectMap = this.objectMap;
    let condSQL = null;
    if(objectMap.referenceValue) {
      condSQL = `"${objectMap.referenceValue} = '"+ ${predicate} +"'"`
    } else if(objectMap.functionString) {
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

    getLogicalSource() { return this.logicalSource; }
    getSubjectMap() { return this.subjectMap; }
    getPredicateObjectMaps() { return this.predicateObjectMaps; }

    genPRSQL() {
        let objectMaps = this.predicateObjectMaps.map(function(predicateObjectMap) {
            return predicateObjectMap.objectMap;
        });

        let prSQLTriplesMap = objectMaps.reduce(function(filtered, objectMap) {
            let prSQLObjectMap = objectMap.genPRSQL();
            console.log("prSQLObjectMap = " + prSQLObjectMap)
            if(prSQLObjectMap != null) {
              filtered.push(prSQLObjectMap)
            }
        

            return filtered
          }, []).join(",");

          console.log("prSQLTriplesMap = " + prSQLTriplesMap)
          return prSQLTriplesMap;
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
