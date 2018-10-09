const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const temp = require('temp').track();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const sqlite = require('sqlite3');

const url = require('url');
const fs = require('fs');
const uuid = require('uuid');
const rmlparser = require('./rml-parser');
const javascriptsqlitetransformer = require('./transformers/javascript/sqlite/javascript-sqlite-transformer');
const sqlitecretator = require('./transformers/javascript/sqlite/sqlitecreator');

const pythonmongodbtransformer = require('./transformers/python/mongodb/python-mongodb-transformer');
//const mongodbpythontransformer = require('./mongodb-python-transformer');
var JSZip = require("jszip");
var zipper = require('zip-local');
const archiver = require('archiver');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/**
 * @param {String} source
 * @param {String} out
 * @returns {Promise}
 */
function zipDirectory(source, out) {
    const archive = archiver('zip', { zlib: { level: 9 }});
    const lambdaStream = fs.createWriteStream(out);
  
    return new Promise((resolve, reject) => {
      archive
        .directory(source, false)
        .on('error', err => reject(err))
        .pipe(lambdaStream)
      ;
  
      lambdaStream.on('close', () => resolve());
      archive.finalize();
    });
}

/**
 * @param {String} source
 * @param {String} out
 * @returns {Promise}
 */
function zipDirectory2(source, out) {
    const archive = archiver('zip', { zlib: { level: 9 }});
    const lambdaStream = fs.createWriteStream(out);
    archive
        .directory(source, false)
        .on('error', err => reject(err))
        .pipe(lambdaStream)
    ;

    archive.finalize();
}

app.set('view engine', 'pug')
app.use(express.static('views'))

//app.get('/', (req, res) =>
//  res.send('Hello World!'))

app.get('/', function (req, res){
    res.render('transform', {message: 'Welcome to Mapping Translator!\nTranslate your OBDA mappings to GraphQL Resolvers'})
})

writeZip = function(dir,name) {
    var zip = new JSZip(),
        code = zip.folder(dir),
        filename = ['jsd-',name,'.zip'].join('');
    
    fs.writeFileSync("tmp" + filename, "tmp.zip");
    console.log('creating ' + filename);
    };

app.get('/testzip3', function (req, res){
    var zip = new JSZip();
    zip.folder("./tmp/0763b3bc-5e3a-446c-8a90-1e85cd7f9e3b")
    var promise = zip.generateNodeStream({streamFiles:true})
    .pipe(fs.createWriteStream('out.zip'))
    .on('finish', function () {
        // JSZip generates a readable stream with a "end" event,
        // but is piped here in a writable stream which emits a "finish" event.
        console.log("out.zip written.");
    });



    res.render('transform', {message: 'Welcome to Mapping Translator!\nTranslate your OBDA mappings to GraphQL Resolvers'})
})



app.get('/testzip4', function (req, res){
    zipper.sync.zip("./tmp/").compress().save("tmp.zip");

    res.render('transform', {message: 'Welcome to Mapping Translator!\nTranslate your OBDA mappings to GraphQL Resolvers'})
})

app.get('/testzip', function (req, res){
    zipDirectory("tmp/5d288b25-4793-468e-a791-30c99c569441", "tmp/5d288b25-4793-468e-a791-30c99c569441.zip")
    res.render('transform', {message: 'Welcome to Mapping Translator!\nTranslate your OBDA mappings to GraphQL Resolvers'})
})

app.get('/testzip5', function (req, res){
    zipDirectory2("tmp", "tmp.zip")
    res.render('transform', {message: 'Welcome to Mapping Translator!\nTranslate your OBDA mappings to GraphQL Resolvers'})
})

app.get('/testzip2', function (req, res){
    // create a file to stream archive data to.
    var output = fs.createWriteStream('tmp/example.zip');
    var archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    output.on('end', function() {
        console.log('Data has been drained');
    });

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
            // log warning
        } else {
            // throw error
            throw err;
        }
    });

    // good practice to catch this error explicitly
    archive.on('error', function(err) {
        throw err;
    });

    // pipe archive data to the file
    archive.pipe(output);

    // append files from a sub-directory, putting its contents at the root of archive
    archive.directory('tmp/', false);


    // finalize the archive (ie we are done appending files but streams have to finish yet)
    // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
    archive.finalize();


    res.render('transform', {message: 'Welcome to Mapping Translator!\nTranslate your OBDA mappings to GraphQL Resolvers'})
})

app.get('/transform', function (req, res){
    res.render('transform', {message: 'Welcome to Mapping Translator!\nTranslate your OBDA mappings to GraphQL Resolvers'})
})

//app.post('/transform', urlencodedParser, function (req, res) {
app.post('/transform', function (req, res) {
  if (!req.body) { return res.sendStatus(400) }
  console.log("req.body.keys = " + req.body.keys)
  console.log("req.body.length = " + req.body.length)
  console.log(`req.body.prog_lang = ${req.body.prog_lang}`)
  console.log(`req.body.dataset_type = ${req.body.dataset_type}`)
  console.log(`req.body.mapping_url = ${req.body.mapping_url}`)
  console.log(`req.body.db_name = ${req.body.db_name}`)
  console.log(`req.body.port_no = ${req.body.port_no}`)
  
  
    if(req.body.prog_lang && req.body.dataset_type && 
        req.body.mapping_url && req.body.db_name){
        //var random_text = create_resolver(req.body.prog_lang, req.body.mapping_language, req.body.dataset_type, req.body.mapping_url, req.body.db_name)
        //res.download('./tmp/'+random_text+".zip")

        var random_text_promise = create_resolver(req.body.prog_lang, 
            req.body.mapping_language, req.body.dataset_type, 
            req.body.mapping_url, req.body.db_name, req.body.port_no)
        random_text_promise.then(
            random_text => res.download('./tmp/'+random_text+".zip"),
        )
         //res.json({"msg": "success!"})
         
    } else {
        res.json({ "error": "parameters are not passed" });
        //res.send(JSON.stringify({"error":'expecting map_lang, prog_lang, and dataset_type' }))
    }
})

async function create_resolver(prog_lang, map_lang, dataset_type, mapping_url, 
    db_name, port_no){

    console.log("prog_lang = "+ prog_lang)
    console.log("map_lang = "+ map_lang)
    console.log("dataset_type = "+ dataset_type)
    console.log("mapping_url = "+ mapping_url)
    console.log("database name = "+db_name)
    console.log("port_no = "+ port_no)
    if(port_no == null || port_no == undefined ) { port_no = 4321 }


    if (!fs.existsSync("tmp")){
        fs.mkdirSync("tmp");
    }

    var random_text = uuid.v4();
    var project_dir = './tmp/'+random_text+"/";
    if (!fs.existsSync(project_dir)){
        fs.mkdirSync(project_dir);
    }
    
    var data;
    if(map_lang == 'rml') {
        console.log(`PARSING MAPPING DOCUMENT FROM ${mapping_url} ...`)
        data = rmlparser.get_jsonld_from_mapping(mapping_url)
    } else {
        console.log(map_lang + " is not supported yet!")
    }

    var class_name = data["class_name"]
    var logical_source = data["logical_source"]
    var predicate_object = data["predicate_object"]
    var listOfPredicateObjectMap = data["predicate_objectmap"]
    var predicateObjectMaps = data["predicateObjectMaps"];
    //console.log(`predicateObjectMaps = ${predicateObjectMaps}`)


    let triplesMap = data["triplesMap"];
    let mappingDocument = data["mappingDocument"];
    console.log(`mappingDocument = ${mappingDocument}`);
    console.log(`mappingDocument.triplesMaps = ${mappingDocument.triplesMaps}`)

    if(prog_lang == 'python' && dataset_type == 'mongodb') {


        var schema = pythonmongodbtransformer.generateSchema(class_name, 
            logical_source, predicate_object)
        //console.log("generated schema = \n" + schema )
        
        fs.writeFileSync(project_dir+"schema.py", schema, function (err){
            if(err){
               console.log('ERROR saving schema: '+err);
            }
            });

        var model = pythonmongodbtransformer.generateModel(class_name, logical_source, 
            predicate_object)
        //console.log("generated model = \n" + model )
        
        fs.writeFileSync(project_dir+"models.py", model, function (err){
                     if(err){
                        console.log('ERROR saving model: '+err);
                     }
                     });
        var pyapp_content = pythonmongodbtransformer.generate_app(db_name);
        //console.log("pyapp_content: "+pyapp_content)
        fs.writeFileSync(project_dir+"app.py", pyapp_content);
        fs.writeFileSync(project_dir+"requirements.txt", pythonmongodbtransformer.generate_requirements());
        fs.writeFileSync(project_dir+"startup.sh", pythonmongodbtransformer.generate_statup_script());

        /*
        const { execSync } = require('child_process');
        execSync('cd ./tmp;zip -r '+random_text+".zip "+random_text, function(err, stdout, stderr){
             if (err) {
            // node couldn't execute the command
             console.log('ERROR: '+err)
             return;
             }
             // the *entire* stdout and stderr (buffered)
             console.log(`stdout: ${stdout}`);
             console.log(`stderr: ${stderr}`);
             });
             */

        await zipDirectory("tmp/" + random_text, "tmp/" + random_text + ".zip");
        return random_text;



        //zipper.sync.zip("tmp/" + random_text).compress().save("tmp/" + random_text + ".zip");

        //zipDirectory2("tmp/" + random_text, "tmp/" + random_text + ".zip")
    } else if(prog_lang == 'javascript' && (dataset_type == 'sqlite' || dataset_type == 'csv')) {
        let tempdb = null;
        if(dataset_type == 'csv') {
            tempdb = await sqlitecretator.createSQLite(mappingDocument,db_name,sqlite);
        }

        let appString = javascriptsqlitetransformer.generateApp(
            triplesMap,
            mappingDocument,
            db_name, port_no)
        fs.writeFileSync(project_dir+"app.js", appString, function (err){
            if(err){
               console.log('ERROR saving schema: '+err);
            }
        });
        if(db_name.endsWith(".csv")){
            db_name = db_name.split(".csv")[0].split("/")[db_name.split(".csv")[0].split("/").length-1]+'.sqlite';
        }
        fs.writeFileSync(project_dir+"package.json", javascriptsqlitetransformer.generate_requirements());
        fs.writeFileSync(project_dir+"startup.sh", javascriptsqlitetransformer.generate_statup_script_sh());
        fs.writeFileSync(project_dir+"startup.bat", javascriptsqlitetransformer.generate_statup_script_bat());
        if(dataset_type=='csv'){
            console.log(`tempdb = ${tempdb}`)
            fs.writeFileSync(project_dir+db_name,fs.readFileSync(tempdb.path));
       }

        await zipDirectory("tmp/" + random_text, "tmp/" + random_text + ".zip");
        return random_text;

    } else {
        console.log(prog_lang + "/" +  dataset_type + " is not supported yet!")
    }

    return random_text;
    
}




var wait = ms => new Promise((r, j)=>setTimeout(r, ms))

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function demo() {
    console.log('Taking a break...');
    await sleep(2000);
    console.log('Two seconds later');
  }
  

app.listen(8082, () => console.log('Mapping Translator is listening on port 8082!'))
