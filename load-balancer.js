//small utility to function to select a target based on a key 
let config = require('./config');
let HashRing = require('./pyx-hash-ring');
let request = require('request');

let targetIndex = 0;

let lastTargets = "";
let rings = {};
let ringsOrder = [];

function updateTargets(targets) {
	let newTargets = JSON.stringify(targets);
	if (newTargets == lastTargets) {
		return;
	}
	rings = {};
	for (let category in targets) {
		rings[category] = new HashRing(targets[category]);
		// console.log("targets", category, targets[category]);
	}
	ringsOrder = Object.keys(rings);
	ringsOrder.sort((a,b) => b.length - a.length);

	lastTargets = newTargets;
}

updateTargets(config.targets);

function getRandomTarget(ring) {
	targetIndex = (targetIndex + 1) % ring.nodes.length;
	return ring.nodes[targetIndex];
}

function loadBalancer(category, key) {
	let ring = rings[category];
	if (!ring || ring.length == 0) {
		ring = rings["server"];
	}
	if (!key) {
		return getRandomTarget(ring);
	}
	return ring.endpoint(key);
}


//check if we have a cluster to get endpoints from
if (config.cluster) {

	if (config.cluster.url) {
		console.log('forwarding request based on endpoints on ' + config.cluster.url);

		let io = require('socket.io-client')(`${config.cluster.url}/endpoint`);

		let targets = config.targets;

		io.on('endpoints', (changes) => {
			for(let service in changes) {
				for(let prefix in changes[service]) {
					let endpoints = changes[service][prefix];
					let key = prefix.toLowerCase();
					if (!(key in targets)) {
						targets[key] = [];
					}
					targets[key] = targets[key].concat(endpoints);
				}
			}
			console.log('targets', targets);
			updateTargets(targets);
		});

	}
}

// Finds ring based on req url perfiex. each ring can now report path(s) to accept.
loadBalancer.findRing = function(reqUrl) {
	let match = reqUrl.toLowerCase();
	if (match.startsWith('/')) {
		match = match.slice(1);
	}
	for(let prefix of ringsOrder) {
		if (match.startsWith(prefix) || prefix === '*') {
			return prefix;
		}
	}
	return undefined;
}

// Check if a ring has nodes in it
loadBalancer.ringReady = function(category) {
	return ((category in rings) && rings[category].length>0);
}

// return if we have all the needed services running
loadBalancer.status = function () {
	var ringStatus = {};
	for (var name in rings) {
		ringStatus[name] = rings[name].length;
	}
	var ok = ringStatus["api"] && ringStatus["*"];

	return {
		status: ok ? "ok" : "error",
		cluster: ringStatus
	}
}

module.exports = loadBalancer;