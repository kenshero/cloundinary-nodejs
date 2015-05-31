var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var path    = require("path");
var cloudinary = require('cloudinary');

var multer  = require('multer');
app.use(multer({ dest: './uploads/'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('trust proxy', 1);
app.use(session({secret: 'ssshhhhh'}));

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/wishlist';

app.use(express.static(__dirname + '/public'));

var members = null ;
var lists = null ;

MongoClient.connect(url, function(err, db) {

	members = db.collection('member');
	lists   = db.collection('imgs');
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

	var findMem = {
		_id :new ObjectID(req.session.idUser)
	};

	members.findOne(findMem, function(err, result) {

		lists.find(find).toArray(function(err,docs) {
		  if(err)
		  	throw err;
		  docs.push(result);
		  res.send(docs);
		});	

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

app.post('/uploadImg',checkLogin,function(req,res){
	cloudinary.uploader.upload(req.files.img.path,function(result) { 
	
	var wish = {
		url_img    : result.url,
		id_user	   : req.session.idUser
	};	

		lists.insert(wish,function(err, result) {
			if(err)
				throw err;
			res.redirect('/home');
		});		
	});
});

app.delete('/deleteWish/:id_wish',function(req,res){
	console.log(req.params.id_wish);

	var id_wish = {
		_id : new  ObjectID(req.params.id_wish)
	};

	lists.remove(id_wish, function(err, result) {
		if (err)
			throw err;
		res.send(result);
	});    

});

app.post('/editWish',function(req,res){
	console.log(req.body);
	console.log(req.body._id);
	var find={};
	var newData={};

	if (req.body._id)
		find._id = new ObjectID(req.body._id);

	if (req.body.name_wish)
		newData.name_wish=req.body.name_wish

	if (req.body.price_wish)
		newData.price_wish=req.body.price_wish

	if (req.body.id_user)
		newData.id_user=req.body.id_user

	lists.update(find,{'$set' : newData} ,function(err,result){
		if(err)
			throw err;
		res.send(result);
	});

});

cloudinary.config({ 
  cloud_name: 'reviewbook', 
  api_key: '679694477186338', 
  api_secret: '4MQmZM0nlkRuaaO-WbpnR4zPlgs' 
});

function checkLogin(req, res, next) {
    if (req.session.idUser != null)
        return next();
    res.send('กรุณา Login');
}