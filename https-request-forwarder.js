//https request forwarding logic.
var request = require('request');

function handleError(req, res) {
	return function (error) {
		console.log('https request forward failed: ', req.url, error.code);
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('cache-control', 'no-store, no-cache');
		res.writeHead(error.statusCode || 504 /*Gateway Timeout*/, "Failed to forward request to server (" + error.code + ")");
		res.end();
	}
}

function forwardToHTTPS(req, res) {
	
	let target = req.params.protocol + "://" + req.params.host + "/" + req.params[0]
	let url = target + req.url.substring(req.url.indexOf("?"))
	
	if (req.method == 'GET') {
		req.pipe(request(url)).on('error', handleError(req, res)).pipe(res);
	} else if (req.method == 'POST') {
		req.pipe(request.post(url)).on('error', handleError(req, res)).pipe(res);
	} else {
		req.pipe(request(url)).on('error', handleError(req, res)).pipe(res);
	}
}

module.exports = forwardToHTTPS;