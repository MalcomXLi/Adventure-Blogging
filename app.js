var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
//Listens for the environment variable PORT, if there is none then use 3000
app.set('port', (process.env.PORT || 3000));

//Serving files, such as images, CSS, JavaScript and other static files 
app.use('/', express.static(__dirname+ '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var COMMENTS_FILE = path.join(__dirname, 'comments.json');


//get the posts from the comments folder, which will be replaced with directory later
app.get('/api/comments', function(req, res) {
  fs.readFile(COMMENTS_FILE, function(err, data) {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
    //console.log(JSON.parse(data));
  });
});

app.post('/api/comments', function(req, res){
    console.log(req.body);

    fs.readFile(COMMENTS_FILE, function(err, data) {
        var comments = JSON.parse(data);
        comments.push(req.body);
        fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err) {
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(comments);
        });
    });
});

var server = app.listen(app.get("port"), function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', COMMENTS_FILE, port);
});