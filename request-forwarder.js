//request forwarding logic.
var url = require('url');
var request = require('request');

var prob = require('./request-prober');
var loadBalancer = require('./load-balancer');

function handleError(req, res) {
	return function (error) {
		console.log('request forward failed: ', req.url, error.code);
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('cache-control', 'no-store, no-cache');
		res.writeHead(error.statusCode || 504 /*Gateway Timeout*/, "Failed to forward request to server (" + error.code + ")");
		res.end();
	}
}

function forwardRequest(req, res) {
	var ring = loadBalancer.findRing(req.url);

	if (!loadBalancer.ringReady(ring)) {
		handleError(req,res)({statusCode: 502, code: 'NO-TARGETS'});
		return;
	}

	var key = prob.extractGeoSource(req.url);

	var target = loadBalancer(ring, key);

	if (req.method == 'GET') {
		req.pipe(request(target + req.url)).on('error', handleError(req, res)).pipe(res);
	} else if (req.method == 'POST') {
		req.pipe(request.post(target + req.url)).on('error', handleError(req, res)).pipe(res);
	} else {
		req.pipe(request(target + req.url)).on('error', handleError(req, res)).pipe(res);
	}
}

module.exports = forwardRequest;