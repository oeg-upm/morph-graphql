// var http = require('http');
//
// http.createServer(function (req, res) {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     console.log("access: "+req.url);
//
//     res.end();
// }).listen(8082);



const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(8082, () => console.log('Example app listening on port 8082!'))
