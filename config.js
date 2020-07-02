const fs = require('fs');
const path = require('path');

// Extracting the port given by AZURE or use 1337 (for dev)
let port = process.env.PORT || 1337;

// Extracting the host name given by AZURE or use 'localhost' (for dev)
let host = process.env.WEBSITE_HOSTNAME || 'localhost';

let cluster = {
	url: process.env.GGS_CLUSTER_MASTER || (host == 'localhost' ? 'http://localhost:8080' : '')
};

let targets = {};
if (process.env.PROXY_TARGETS) {
	targets = JSON.parse(process.env.PROXY_TARGETS);
}

let https = undefined;

if (process.env.SSL_FOLDER) {
	if (fs.existsSync(path.join(process.env.SSL_FOLDER,'cert.pfx')) && process.env.SSL_PASSPHRASE) {
		https = {
			pfx: fs.readFileSync( path.join(process.env.SSL_FOLDER,'cert.pfx')),
			passphrase: process.env.SSL_PASSPHRASE
		}
	} else if (fs.existsSync(path.join(process.env.SSL_FOLDER,'cert.pem'))) {
		https = {
			key: fs.readFileSync( path.join(process.env.SSL_FOLDER,'key.pem')),
			cert: fs.readFileSync( path.join(process.env.SSL_FOLDER,'cert.pem'))
		}
	}
}

module.exports = {
	port,
	host,
	targets,
	cluster,
	https
};