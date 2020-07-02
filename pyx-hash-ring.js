const hash = require('./pyx-hash');
const bs = require("binary-search");

function calculateStopPoints(node,numberOfPoints) {
	let lastHash = 0;
	let stopPoints = [];
	for(var point=0;point<numberOfPoints;point++) {
		let key = `${node}(${point},${lastHash})`;
		lastHash = hash(key);
		stopPoints.push(lastHash);
	}
	return stopPoints;
}


class HashRing {
	constructor(nodes,pointsPerNode = 64) {
		this._nodes = nodes;
		this.pointsPerNode = pointsPerNode;

		this.updateStopPoints();
	}

	updateStopPoints() {
		this.stopPoints = [];
		for(let node of this.nodes) {
			let nodeStopPoints = calculateStopPoints(node,this.pointsPerNode);
			for(let stopPoint of nodeStopPoints) {
				this.stopPoints.push({hash:stopPoint,node:node});
			}
		}
		this.stopPoints.sort((a,b)=>{
			if (a.hash>b.hash) return 1;
			if (a.hash<b.hash) return -1;
			return 0;
		});
	}

	endpoint(key) {
		return this.endpointForHash(hash(key))
	}

	endpointForHash(hash) {
		let index = bs(this.stopPoints,hash,(point,hash)=> { return point.hash - hash; });
		if (index>=0) {
			return this.stopPoints[index].node;
		}
		index = ~index;
		if (index == this.stopPoints.length) {
			index = 0;
		}
		return this.stopPoints[index].node;
	}

	get nodes() {
		return this._nodes;
	}
	get length() {
		return this.nodes.length;
	}
}

module.exports = HashRing