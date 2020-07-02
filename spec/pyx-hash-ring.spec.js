var HashRing = require('../pyx-hash-ring')


describe("pyx-hash-ring", function () {
	it("number of stop points is correct", function () {
		let nodes = ["http://localhost:8000", "http://localhost:8001", "http://localhost:8002", "http://localhost:8003", "http://localhost:8004", "http://localhost:8005"];
		let ring = new HashRing(nodes, 16);

		expect(ring.length).toEqual(nodes.length);
		expect(ring.stopPoints.length).toEqual(nodes.length * 16);

		let numberOfPointsPerNode = {};
		for (var stopPoint of ring.stopPoints) {
			numberOfPointsPerNode[stopPoint.node] = (numberOfPointsPerNode[stopPoint.node] || 0)+1;
		}

		for(var node in numberOfPointsPerNode) {
			expect(numberOfPointsPerNode[node]).toEqual(16);
		}	
		
	});

	it("getEndPointForHash return the right point", function () {
		let nodes = ["http://localhost:8000", "http://localhost:8001", "http://localhost:8002", "http://localhost:8003", "http://localhost:8004", "http://localhost:8005"];
		let ring = new HashRing(nodes, 16);

		let stopPoints = ring.stopPoints;

		for (let stopPoint of stopPoints) {
			var hash = stopPoint.hash;
			expect(ring.endpointForHash(hash - 1)).toEqual(stopPoint.node);
			expect(ring.endpointForHash(hash)).toEqual(stopPoint.node);
		}

		var firstStop = stopPoints[0];
		var lastStop = stopPoints[stopPoints.length-1];

		expect(ring.endpointForHash(lastStop.hash+1)).toEqual(firstStop.node);
	});
});