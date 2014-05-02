var host = "127.0.0.1";
var port = 1337;
var path = require('path');
var express = require('express');
var app = express();

app.use(require("connect").bodyParser());
// app.use(app.router);
app.use(express.static(__dirname + '/../'));

app.get('/', function(req, res){
  res.sendfile('./index.html', {'root': path.resolve("./")});
});

app.listen(port);
