var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var routes = require('./routes/routes');//to get routes

//Session Cookie set up start 
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var session = require('express-session');
app.use(session({
  secret: 'malcomandronnieadventureblogging',
  resave: false,
  saveUninitialized: true,
}));

//Session Cooke set up ends

//MONGO SET UP START
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://travelblog:blog@ds045454.mongolab.com:45454/travelblog');
//mongoose.connect('mongodb://localhost:27017/travel');
var db = mongoose.connection;
var Schema = mongoose.Schema;

var blogSchema = new Schema({
  Login:  String,
  Password: String,
}, { collection: db_name });

var db_name = "travel";
var collection_name = 'travel';
//MONGO SET UP END

//Listens for the environment variable PORT, if there is none then use 3000
app.set('port', (process.env.PORT || 3000));

//passing database on
app.use(function(req,res,next){
    req.db = db;
    req.blogSchema = blogSchema;
    next();
});


//Serving files, such as images, CSS, JavaScript and other static files 
app.use('/', express.static(__dirname+ '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));//or else you cant write


//get the posts from the comments folder, which will be replaced with directory later
//READ
app.get('/login', function(req, res) {
    var db = req.db;
    res.setHeader('Cache-Control', 'no-cache');
    findUsers(collection_name, {}, function (err, data) {
           //console.log(data);
           res.json((data));
        });
});

//Login 
app.post('/login', function(req, res){
    var sess = req.session;
    var login = req.body.Login;
    var password = req.body.Password;
    var blogSchema = req.blogSchema;
    var User = mongoose.model(db_name, blogSchema, collection_name);
    findUsers(collection_name, {"Login": login, "Password": password}, function (err, docs) {
            if(docs.length > 0){//valid user!
                sess.user = login;
                var timeout = 2*60*1000;//2mins
                sess.cookie.expires = new Date(Date.now()+timeout);
                console.log(req.session.user);
                res.status(201).json({'rememberme' : '1'});
                console.log("success");
            }else{
                res.status(201).json('Login Failed');
                console.log("failed");
            }
        });
    });

//Sign up
app.post('/signup', function(req, res){
    console.log(req.body);
    console.log(db_name);
     // Set our internal DB variable
    var db = req.db;
    var blogSchema = req.blogSchema;
    var User = mongoose.model(db_name, blogSchema, collection_name);
    // Get our form values. These rely on the "name" attributes
    var newLogin = req.body.Login;
    var newPassword = req.body.Password;
    
    var newUser = new User({
        Login: newLogin,
        Password: newPassword
    });
    
    newUser.save(function(err) {
    //if (err) throw err;
        if (err !== null) {
            res.status(500).json({ error: "save failed", err: err});
            return;
        } else {
            console.log("success");
            res.status(201).json(newUser);
        };
    });

});

//DELETE
app.post('/api/delete', function(req, res){
    console.log(req.body ['author']);
});


var server = app.listen(app.get("port"), function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s', port);
});

function findUsers (collec, query, callback) {
    mongoose.connection.db.collection(collec, function (err, collection) {
        collection.find(query).toArray(callback);
    });
}