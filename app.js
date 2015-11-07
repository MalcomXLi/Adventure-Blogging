var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var routes = require('./routes/routes');//to get routes
//MONGO SET UP START
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://travelblog:blog@ds045454.mongolab.com:45454/travelblog');
//mongoose.connect('mongodb://localhost:27017/travel');
var db = mongoose.connection;
var Schema = mongoose.Schema;

var entrySchema = new Schema({
	TripName: String, 
	Days: String, 
	Destination: String, 
	Description: String, 
	Itinerary: String, 
	Moments: String, 
	Complaints: String, 
	Suggestions: String, 
	Souvenirs: String,}, { collection: db_name });

var blogSchema = new Schema({
  Login:  String,
  Password: String,
}, { collection: db_name });

var db_name = "travel";
var collection_name = 'travel';
var collection_name_entry = 'entries';
//MONGO SET UP END

//Listens for the environment variable PORT, if there is none then use 3000
app.set('port', (process.env.PORT || 4000));

//passing database on
app.use(function(req,res,next){
    req.db = db;
    req.blogSchema = blogSchema;
	req.entrySchema = entrySchema;
    next();
});


//Serving files, such as images, CSS, JavaScript and other static files 
app.use('/', express.static(__dirname+ '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));//or else you cant write

//Return data of peoples logins for now
//Also check if people are logged in with cache if not hide shit 
app.get('/login', function(req, res) {
    console.log("sess");
    sess = req.session;
    console.log(sess);
    if(sess.user){
        var db = req.db;
        res.setHeader('Cache-Control', 'no-cache');
        findUsers(collection_name, {}, function (err, data) {
               //console.log(data);
               res.json((data));
            });
    }
    else{
        res.json("fuck u ");
    }
});

//WRITE
app.post('/login', function(req, res){
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

//post new entry
app.post('/postentry', function(req, res){
	console.log("app js post");
    console.log(req.body);
    console.log(db_name);
     // Set our internal DB variable
    var db = req.db;
    var entrySchema = req.entrySchema;
    var Post = mongoose.model(db_name, entrySchema, collection_name_entry);
    // Get our form values. These rely on the "name" attributes
    var name = req.body.TripName;
    var days = req.body.Days;
	var dest = req.body.Destination;
	var descrip = req.body.Description;
	var itin = req.body.Itinerary;
	var moments = req.body.Moments;
	var complaints = req.body.Complaints;
	var suggestions = req.body.Suggestions;
	var souvenirs = req.body.Souvenirs;
    
    var newPost = new Post({
        TripName: name,
		Days: days, 
		Destination: dest, 
		Description: descrip, 
		Itinerary: itin, 
		Moments: moments, 
		Complaints: complaints, 
		Suggestions: suggestions, 
		Souvenirs: souvenirs
    });
    console.log("here is post");
	console.log(newPost);
    newPost.save(function(err) {
    //if (err) throw err;
        if (err !== null) {
            res.status(500).json({ error: "save failed", err: err});
            return;
        } else {
            console.log("success");
            res.status(201).json(newPost);
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

    console.log('Example app listening at http://%s:%s', port);
});

function findUsers (collec, query, callback) {
    mongoose.connection.db.collection(collec, function (err, collection) {
        collection.find(query).toArray(callback);
    });
}