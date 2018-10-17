const temp = require('temp').track();
const fs = require('fs');
const getCSV = require('get-csv');

exports.createSQLite = async function (mappingDocument, db_name,sqlite){
    var tempdb=temp.openSync('temp');
    if( db_name !== 'undefined' && db_name.endsWith(".csv")) {
        console.log(`Reading CSV File From ${db_name} ...`);
        let csvRows = await getCSV(db_name);
        console.log(`tempdb = ${tempdb}`)
        for(var i=0; i<mappingDocument.triplesMaps.length; i++) {
            let triplesMap = mappingDocument.triplesMaps[i];
            let logicalSource = triplesMap.logicalSource;
            let primaryKeys = extractPrimaryKeys(triplesMap.subjectMap);
            var functionColumns=createFunctionColumn(triplesMap.getPredicateObjectMaps());
            await createdb(csvRows,logicalSource,tempdb,primaryKeys,sqlite,functionColumns);
        }
    } else {
        for(var i=0; i<mappingDocument.triplesMaps.length; i++) {
            let triplesMap = mappingDocument.triplesMaps[i];
            let logicalSource = triplesMap.logicalSource;
            let primaryKeys = extractPrimaryKeys(triplesMap.subjectMap);
            if(logicalSource.endsWith(".csv")) {
                //download the file and create the sqlite, change db_name
                console.log(`Reading CSV File From ${logicalSource} ...`)
                let csvRows = await getCSV(logicalSource);
                //let tableName = logicalSource.split(".csv")[0].split("/")[logicalSource.split(".csv")[0].split("/").length-1];
                let tableName = triplesMap.getAlpha();
                var functionColumns=createFunctionColumn(triplesMap.getPredicateObjectMaps());
                await createdb(csvRows,tableName,tempdb,primaryKeys,sqlite,functionColumns);
            }
        }
    }
    return tempdb;
}


function createFunctionColumn(predicate_objectmaps){
    let columns = [];
    for(let i=0; i<predicate_objectmaps.length; i++){
        let predicate_objectMap = predicate_objectmaps[i];
        if(predicate_objectMap.objectMap.functionString){
            let element = {};
            element.column =  predicate_objectMap.predicate;
            element.function = predicate_objectMap.objectMap.functionString;
            columns.push(element);
        }
    }
    return columns;
}

function extractPrimaryKeys(subjectMap){
    let primaryKeys=[];
    if(subjectMap.referenceValue){
        primaryKeys.push(subjectMap.referenceValue);
    }
    else if (subjectMap.template || subjectMap.functionString){
       let subjectMapColumns = subjectMap.template.split("{");
       if(subjectMapColumns === 'undefined')
           subjectMapColumns = subjectMap.functionString.split("{");
       for(let i =1 ; i<subjectMapColumns.length ; i++ ){
            let key = subjectMapColumns[i].split("}")[0];
            primaryKeys.push(key);
       }
    }
    //console.log(`primaryKeys = ${primaryKeys}`)
    return primaryKeys;

}


function createdb(csvRows,source_name,tempdb,primaryKeys,sqlite,functionColumns){
    //console.log(`tempdb = ${tempdb}`)
    //console.log(`source_name = ${source_name}`)

    var db = new sqlite.Database(tempdb.path,sqlite.OPEN_READWRITE);

    return new Promise((resolve, reject) => {

        var createTableString = 'CREATE TABLE IF NOT EXISTS '+source_name+" (";
        let headers = Object.keys(csvRows[0]);
        for (let column = 0 ; column < headers.length; column ++){
            createTableString += headers[column] + ' VARCHAR(200), ';
        }
        functionColumns.forEach(function(element) {
            createTableString += element.column + ' VARCHAR(200), ';
        });
        createTableString = createTableString.substr(0, createTableString.length-2) + ', PRIMARY KEY ('+primaryKeys.join(',')+'));';
        db.serialize(() =>{
            db.run(createTableString);
            console.log(createTableString);
            for(let i=0; i<csvRows.length ; i++){
                console.log(Object.values(csvRows[i]));
                let values = "\""+Object.values(csvRows[i]).join('","')+"\"";
                functionColumns.forEach(function() {
                    values += ', NULL';
                });
                console.log(values);
                var insert = "INSERT INTO "+source_name+" VALUES ("+values+");";
                console.log(`SQL INSERT = ${insert}`);
                db.run(insert);
                console.log(`inserted`);
                functionColumns.forEach(function (element) {
                    let update = 'UPDATE '+source_name+ ' SET ' + element.column +' = (SELECT '+ element.function + ' FROM '+source_name+' WHERE '+element.column+ ' is NULL);';
                    console.log(`SQL UPDATE = ${update}`);
                    db.run(update);
                    console.log(`updated`);
                })

            }
        });

        db.close((err) => {
            if (err) {
                reject(err);
                return console.error(err.message);
            }
            else
                resolve();
        });
    });
}