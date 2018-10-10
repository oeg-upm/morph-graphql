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
            await createdb(csvRows,logicalSource,tempdb,primaryKeys,sqlite);
        }
    } else {
        for(var i=0; i<mappingDocument.triplesMaps.length; i++) {
            let triplesMap = mappingDocument.triplesMaps[i];
            let logicalSource = triplesMap.logicalSource;
            let primaryKeys = extractPrimaryKeys(triplesMap.subjectMap);
            if(logicalSource.endsWith(".csv")) {
                //download the file and create the sqlite, change db_name
                let csvRows;
                console.log(`Reading CSV File From ${logicalSource} ...`)
                csvRows = await getCSV(logicalSource);
                //let tableName = logicalSource.split(".csv")[0].split("/")[logicalSource.split(".csv")[0].split("/").length-1];
                let tableName = triplesMap.getAlpha();
                await createdb(csvRows,tableName,tempdb,primaryKeys,sqlite);
            }
        }
    }
    return tempdb;
}

function extractPrimaryKeys(subjectMap){
    let primaryKeys="";
    if(subjectMap.referenceValue){
        return subjectMap.referenceValue;
    }
    else if (subjectMap.template || subjectMap.functionString){
       let subjectMapColumns = subjectMap.template.split("{");
       for(let i =1 ; i<subjectMapColumns.length ; i++ ){
            let key = subjectMapColumns[i].split("}")[0];
            primaryKeys += key + ",";
       }
       return primaryKeys.substr(0,primaryKeys.length-1);
    }

}


function createdb(csvRows,source_name,tempdb,primaryKeys,sqlite){
    console.log(`tempdb = ${tempdb}`)
    console.log(`source_name = ${source_name}`)

    var db = new sqlite.Database(tempdb.path,sqlite.OPEN_READWRITE);

    return new Promise((resolve, reject) => {

        var createTableString = 'CREATE TABLE IF NOT EXISTS '+source_name+" (";
        let headers = Object.keys(csvRows[0]);
        for (let column = 0 ; column < headers.length; column ++){
            createTableString += headers[column] + ' VARCHAR(200), ';
        }
        createTableString = createTableString.substr(0, createTableString.length-2) + ', PRIMARY KEY ('+primaryKeys+'));';
        db.serialize(() =>{
            db.run(createTableString);
            console.log(createTableString);
            for(let i=0; i<csvRows.length ; i++){
                console.log(Object.values(csvRows[i]));
                let values = "\""+Object.values(csvRows[i]).join('","')+"\"";
                console.log(values);
                var insert = "INSERT INTO "+source_name+" VALUES ("+values+");";
                console.log(insert);
                db.run(insert);
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