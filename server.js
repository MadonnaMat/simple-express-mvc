var express = require('express');
var app = express();
var routes = require('./routes.json');
var db_json = require('./db.json');
var mysql = require('mysql');

app.use(express.static(__dirname + '/public_html'));

app.use(app.router);
connection = mysql.createConnection(db_json);

connection.connect();


var posts = routes.post;
for ( var i in posts) {
	var controller = require('./controllers/' + posts[i].controller + '.js');
	for ( var call in posts[i].calls){
		var thisCall = '/' + posts[i].controller + '/' +  posts[i].calls[call].uri;
		var thisFunction = controller[posts[i].calls[call].function];
		app.post(thisCall, thisFunction);
	}
}

var gets  = routes.get;
for ( var i in gets) {
	var controller = require('./controllers/' + gets[i].controller + '.js');
	for ( var call in gets[i].calls){
		var thisCall = '/' + gets[i].controller + '/' +  gets[i].calls[call].uri;
		var thisFunction = controller[gets[i].calls[call].function];
		app.get(thisCall, function(req, res, next){
			console.log("\n\nGET CALL: " + thisCall + " STARTED");
			req.startTime = Date.now();
			thisFunction.call(this, req, res, next);
		}, function(req, res){
			console.log('GET CALL: ' + thisCall + ' FINISHED: ' + (Date.now() - req.startTime) + 'ms');
		});	
	}
}


app.listen(8081);
console.log('server started on 8081');
