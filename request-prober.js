var url = require('url');

var requestProber = {}

//trying to extract geosource id from url query parameters.
function extractGeoSourceFromUrl(reqUrl) {
	if (!reqUrl) {
		return undefined;
	}
	reqUrl = url.parse(reqUrl,true);
	for (var key in reqUrl.query) {
		if (key.toLowerCase() == 'geosource') {
			return reqUrl.query[key];
		}
	}
	var match = reqUrl.pathname.match(/\/geosource\/([^\/\?\#]*)/i);
	if (match) {
		return match[1];
	}
	match = reqUrl.pathname.match(/\/geometry\/([^\/\?\#]*)/i);
	if (match) {
		return match[1];
	}
}

// extract which servers should get each request
function extractCategory(reqUrl) {
	if (reqUrl && reqUrl.toLowerCase().startsWith('/api/')) {
		return "server"
	} else if (reqUrl.toLowerCase().startsWith('/tasks/')) {
		return "cluster";
	} else {
		return "ui";
	}
}


requestProber.extractGeoSource = function(url) {
	return extractGeoSourceFromUrl(url);
}

requestProber.extractCategory = function(url) {
	return extractCategory(url);
}

module.exports = requestProber;