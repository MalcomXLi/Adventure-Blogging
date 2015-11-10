var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var routes = require('./routes/routes');//to get routes
app.engine('html', require('ejs').renderFile);

//Session Cookie set up start 
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var session = require('express-session');
app.use(session({
  secret: 'malcomandronnieadventureblogging',
  resave: false,
  saveUninitialized: true,
}));

var cookie_timeout = 2*60*1000; //time it takes for cookie to die

//Session Cooke set up ends


//MONGO SET UP START
var mongo = require('mongodb');
var mongoose = require('mongoose');
//mongoose.connect('mongodb://travelblog:blog@ds045454.mongolab.com:45454/travelblog');
mongoose.connect('mongodb://localhost:27017/travel');
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

var userSchema = new Schema({
  Login:  String,
  Password: String,
  Email: String, 
  Fname: String,
  Lname: String, 
  Gender: String,
}, { collection: db_name });

var db_name = "travel";
var collection_name_users = 'users';
var collection_name_entry = 'entries';
//MONGO SET UP END

//Listens for the environment variable PORT, if there is none then use 3000
app.set('port', (process.env.PORT || 4000));

//passing database on
app.use(function(req,res,next){
    req.db = db;
    req.userSchema = userSchema;
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
    sess = req.session;
    if(sess.user){
        var db = req.db;
        res.setHeader('Cache-Control', 'no-cache');
        getLogins(collection_name_users, {}, function (err, data) {
               res.json((data));
            });
    }
    else{
        res.render('login.html');
    }
});

//Login 
app.post('/login', function(req, res){
    var sess = req.session;
    var login = req.body.Login;
    var password = req.body.Password;
    var userSchema = req.userSchema;
    var User = mongoose.model(db_name, userSchema, collection_name_users);
    findUsers(collection_name_users, {"Login": login, "Password": password}, function (err, docs) {
            if(docs.length > 0){//valid user!
                sess.user = login;
                var timeout = cookie_timeout;//2mins
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


//post new entry
app.post('/signup', function(req, res){
    console.log(req.body);
    console.log(db_name);
     // Set our internal DB variable
    var db = req.db;
    var userSchema = req.userSchema;
    var User = mongoose.model(db_name, userSchema, collection_name_users);
    // Get our form values. These rely on the "name" attributes
    var newLogin = req.body.Login;
    var newPassword = req.body.Password;
    var newEmail = req.body.Email;
    var newFname = req.body.Fname;
    var newLname = req.body.Lname;
    var newGender = req.body.Gender;
    var newUser = new User({
        Login: newLogin,
        Password: newPassword,
        Email: newEmail,
        Fname: newFname,
        Lname: newLname,
        Gender: newGender
    });
    //save the new user
    newUser.save(function(err) {
    //if (err) throw err;
        if (err !== null) {
            res.status(500).json({ error: "save failed", err: err});
            return;
        } else {
            console.log("success");
            console.log(newUser);
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

    console.log('Example app listening at http://%s', port);
});

function getLogins (collec, query, callback) {
    mongoose.connection.db.collection(collec, function (err, collection) {
        collection.find(query, {"Login":1, "Fname":1}).toArray(callback);
    });
}
function findUsers (collec, query, callback) {
    mongoose.connection.db.collection(collec, function (err, collection) {
        collection.find(query).toArray(callback);
    });
}