var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var path    = require("path");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('trust proxy', 1);
app.use(session({secret: 'ssshhhhh'}));

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/wishlist';

app.use(express.static(__dirname + '/public'));

var members = null ;
var lists = null ;

MongoClient.connect(url, function(err, db) {

	members = db.collection('member');
	lists   = db.collection('list');
	app.listen(3000);
	console.log("connected  port : 3000 ");

});

app.get('/',function(req,res){
	res.sendFile(path.join(__dirname+'/public/index.html'));
});

app.get('/logout',function(req,res){
	req.session.destroy();
	res.redirect('/')
});	

app.get('/getmember',function(req,res){

	members.find().toArray(function(err, docs) {
		res.send(docs);
	});	

});

app.get('/getallWish',checkLogin,function(req,res){

	var find = {
		id_user : req.session.idUser
	}

	lists.find(find).toArray(function(err,docs) {
	  if(err)
	  	throw err;
	  res.send(docs);
	});

});

app.get('/home',checkLogin,function(req,res){
	res.sendFile(path.join(__dirname+'/public/home.html'));
});

app.post('/login', function(req, res){

	var member = {
		username : req.body.user,
		password : req.body.pwd
	};

	members.findOne(member, function(err, result) {

	 	if(err){
	 		res.send(err);
	 	}else if(!result){
	 		res.send("No ID Pass");
	 	}else if(result != null) {
	 		req.session.idUser = result._id;
	 		console.log(req.session.idUser);
	 		res.redirect('/home');
	 	}else{
	 		res.send("ID PASS missing");
	 	}

	});	

});

app.post('/register', function(req,res){

	var member = {
		username : req.body.user,
		password : req.body.pwd
	};

	members.insert(member,function(err, result) {
		if(err)
			throw err;
		res.redirect('/');
	});	

});

app.post('/addWish',checkLogin,function(req,res){

	console.log(req.body.wish);
	
	var wish = {
		name_wish  : req.body.wish.name,
		price_wish : req.body.wish.price,
		id_user	   : req.session.idUser
	};

	lists.insert(wish,function(err, result) {
		if(err)
			throw err;
		res.send(result);
	});	

});


function checkLogin(req, res, next) {
    if (req.session.idUser != null)
        return next();
    res.send('กรุณา Login');
}