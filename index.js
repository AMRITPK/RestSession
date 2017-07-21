var restify = require('restify');
var server = restify.createServer();

//var users = {};
var users = require("./users.js");

var max_user_id = 2;

server.use(restify.acceptParser(server.acceptable));
server.use(restify.bodyParser());





//amrit below
var passport = require("passport");  
var passportJWT = require("passport-jwt");  
var ExtractJwt = passportJWT.ExtractJwt;  
var Strategy = passportJWT.Strategy;  
var jwt = require("jwt-simple");  


var usersPassport = require("./users.js"); 
var cfg = require("./config.js");  
var auth = require("./auth.js")(); 

server.use(auth.initialize());

server.post("/token", function(req, res) {  
    if (req.body.email && req.body.password) {
        var email = req.body.email;
        var password = req.body.password;
        var user = usersPassport.find(function(u) {
            return u.email === email && u.password === password;
        });
        if (user) {
            var payload = {
                id: user.id
            };
            var token = jwt.encode(payload, cfg.jwtSecret);
            res.json({
                token: token
            });
        } else {
           res.writeHead(401);
			res.end('Invalid input');
        }
    } else {
        res.writeHead(401);
			res.end('Invalid ');
    }
});

server.get('/',auth.authenticate(),function(req,res,next){
	
	res.setHeader('content-type','application/json');
	res.writeHead(200);
	res.end(JSON.stringify(users));
	return next();
});

server.get('/user/:id', function(req, res, next){
	res.setHeader('content-type','application/json');
	res.writeHead(200);
	res.end(JSON.stringify(users[parseInt(req.params.id)]));
	return next();
});



server.post('/user', function(req, res, next){
	var user = req.params;
	max_user_id++;
	user.id = max_user_id;
	users[user.id] = user;
	res.setHeader('content-type','application/json');
	res.writeHead(201);
	res.end(JSON.stringify(user));
	return next();
});

server.put('/user/:id', function(req, res, next){
	var user = users[parseInt(req.params.id)];
	var updates = req.params;
	for(var field in updates){
		user[field] = updates[field]; 
	}
	res.setHeader('content-type','application/json');
	res.writeHead(200);
	res.end(JSON.stringify(user));
	return next();
});

server.del('/user/:id', function(req, res,next){
	delete users[parseInt(req.params.id)];
	res.setHeader('content-type','application/json');
	res.writeHead(200);
	res.end(JSON.stringify(true));
	return next();
});


server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});


var validator=require('validator');
var input1=validator.escape('<script>alert("xss");</script>');
console.log(input1);
var unsecaped=validator.unescape(input1);
console.log(unsecaped);