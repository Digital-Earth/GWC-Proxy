var http = require('http');
var https = require('https');
var express = require('express');
var cors = require('cors');
var getPort = require('get-port');

var config = require('./config');
var loadBalancer = require('./load-balancer');
var prob = require('./request-prober');
var forwardRequest = require('./request-forwarder');


var app = express();

app.use(cors());
app.use(function(req,res,next) {
	if (req.path == "/$status") {
		console.log(req.path);
		res.write(JSON.stringify(loadBalancer.status()));
		res.end();
	} else if (req.path == "/$where") {
		let target = prob.extractCategory(req.query.url)
		console.log(req.path,req.query.url,target);
		res.write(target)
		res.end();
	} else {
		next();
	}
});

app.use(forwardRequest);

if (isFinite(config.port)) {
	getPort({port:config.port}).then(function(port) {
		config.port = port;
		startServer();
	}).catch(function(error) {
		console.log(error);
		process.exit(2);
	})
} else {
	startServer();
}

function startServer() {
	let server;
	let endpoint;
	if (config.https) {
		endpoint = `https://${config.host}:${config.port}`;
		server = https.createServer(config.https, app);
	} else {
		endpoint = `http://${config.host}:${config.port}`;
		server = http.createServer(app);
	}
	
	server.listen(config.port, function(error) {
		if (error) {
			console.log(error);
			process.end(1);
		}
		console.log(`*** ENDPOINT *** proxy="${endpoint}"`)
		console.log('We are up and running');
	});
}
