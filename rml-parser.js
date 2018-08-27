//input: original json and modified json
//output: classnamne:String ie Person
exports.get_class_name = function (j){
    var model_name
    for(i=0;i<j["@graph"].length;i++){
        item = j["@graph"][i];
        if("rr:class" in item){
            con_arr = item["rr:class"]["@id"].split(":")
            model_name =  con_arr[con_arr.length-1]
            console.log("model name: "+model_name)
            break
        }
    }
    return model_name
}

//input: original json and modified json
//output: tablename:String ie personas
exports.get_logical_source = function (j){
    var logical_source
    for(i=0;i<j["@graph"].length;i++){
        item = j["@graph"][i];
        if("rml:source" in item){
            logical_source =  item["rml:source"]
            console.log("logical_source: "+logical_source)
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
            pred_obj_map_ids.push(item["rr:predicateObjectMap"]["@id"])
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
    
    for(i=0;i<json["@graph"].length;i++) {
        item = json["@graph"][i]
        if(item["@id"]==objectMapId){
            omReference = item['rml:reference']
        }
    }

    return omReference
}

exports.get_jsonld_from_mapping = function(mapping_url) {
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://rdf-translator.appspot.com/convert/n3/json-ld/"+mapping_url, false);
    xhttp.send();
    console.log('reply: ');
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
    console.log('className = ' + className)

    var listOfPredicateObject =  this.get_predicate_object_map_list(j)
    console.log('listOfPredicateObject = ' + listOfPredicateObject)

    var logicalSource = this.get_logical_source(j)
    res_data["logical_source"] = logicalSource
    console.log('logicalSource = ' + logicalSource)
    var pairsOfPredicateObject = {}
    for(i=0;i<listOfPredicateObject.length;i++){
        predicateObjectMap = listOfPredicateObject[i];
        predicate = this.get_predicate(j, predicateObjectMap)
        console.log('predicate = ' + predicate)

        object = this.get_object(j, predicateObjectMap)
        console.log('object = ' + object)

        pairsOfPredicateObject[predicate] = object
    }
    res_data["predicate_object"] = pairsOfPredicateObject
    console.log('pairsOfPredicateObject = ' + JSON.stringify(pairsOfPredicateObject))
    console.log('res_data: '+JSON.stringify(res_data))
    return res_data
}