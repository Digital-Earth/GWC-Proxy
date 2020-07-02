var hash = require('../pyx-hash.js')


describe("pyx-hash",function() {
	it("hash(hello)", function() {
		expect(hash("hello")).toEqual(269993362);
	});
});