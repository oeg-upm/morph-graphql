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
    //table
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
exports.get_predicate = function(j, predicate_object_map){
    return "Get Predicate to be implemented"
}

//input: original json and modified json and an id of PredicateObjectMap
//output: object column  (ie nombre)
exports.get_object = function(j, predicate_object_map){
    return "Get Object to be implemented"
}