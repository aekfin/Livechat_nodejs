var express = require('express');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var app = express();
var db  = mongojs('contactlist',['contactlist']); 

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.get('/',function(req,res){
  res.sendFile(__dirname + '/public/views/contactlist.html');
});

app.get('/chat',function(req,res){
  res.sendFile(__dirname + '/public/views/livechat.html');
});

app.get('/contactlist' ,function(req, res){
	db.contactlist.find(function(error, docs){
		console.log(docs);
		res.json(docs);
	});
});

app.get('/get/:id' ,function(req, res){
	var id = req.params.id;	
	db.contactlist.find({"_id" : mongojs.ObjectId(id)}, function(error, docs){
		res.json(docs);
	});
});

app.post('/insert_contact',function(req, res){
	db.contactlist.insert(req.body, function(error, data){
		res.json(data);
	});
});

app.post('/send_message/:id',function(req, res){
	var id = req.params.id;	
	db.contactlist.update({"_id" : mongojs.ObjectId(id)}, {$set: {"messages" : req.body.messages}}, function(error, data){
		res.json(data);
	});
});

app.delete('/delete/:id', function(req,res){
	var id = req.params.id;
	db.contactlist.remove({_id: mongojs.ObjectId(id)}, function(error, docs){
		res.json(docs);
	});
});

app.post('/edit/:id', function(req,res){
	var id = req.params.id;
	db.contactlist.update({_id: mongojs.ObjectId(id)}, {$set: {name: req.body.name, email: req.body.email, number: req.body.number}}, {muti:true}, function(error, docs){
		res.json(docs);
		console.log(docs);
	});
});

app.post('/sign_in', function(req,res){
	var key = req.body.name;
	db.contactlist.find({"name" : key}, function(error, docs){
		console.log(docs);
		res.json(docs);
	});
});

app.listen(3000);

console.log("Server runing on port 3000");