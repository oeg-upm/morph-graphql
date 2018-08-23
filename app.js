// var http = require('http');
//
// http.createServer(function (req, res) {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     console.log("access: "+req.url);
//
//     res.end();
// }).listen(8082);

const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.set('view engine', 'pug')
app.use(express.static('views'))

app.get('/', (req, res) =>
  res.send('Hello World!'))


app.get('/test', function (req, res) {
  res.render('transform', {message: 'Hello there!' })
})

app.post('/transform', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  //prog_lang
  //map_lang
  //dataset_type
  if(req.body.map_lang && req.body.prog_lang && req.body.dataset_type){
    //call the transform function
    //res.send(JSON.stringify({ "msg": "parameters are passed successfully" }))
    if(req.body.mapping_url){
      res.json({"msg": "the url is passed"})
    }
    else{
      res.json({"error": "the mapping_url is not passed"})
    }
  }
  else{
    res.json({ "error": "parameters are not passed" });
    //res.send(JSON.stringify({"error":'expecting map_lang, prog_lang, and dataset_type' }))
  }
})


function transform(prog_lang, map_lang, dataset_type){
  create_schema(prog_lang, map_lang, dataset_type)
  create_resolver(prog_lang, map_lang, dataset_type)
}

function   create_resolver(prog_lang, map_lang, dataset_type){

}


function create_schema(prog_lang, map_lang, dataset_type){

}






app.listen(8082, () => console.log('Example app listening on port 8082!'))
