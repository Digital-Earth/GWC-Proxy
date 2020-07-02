var prob = require('../request-prober.js')


describe("request-prober",function() {
	it("geo-source get extracted from url query parameter", function() {
		expect(prob.extractGeoSource('/rgb?key=12&geosource=4f51844f-8f29-45ab-820e-d4d9040dcdc6&format=png')).toEqual("4f51844f-8f29-45ab-820e-d4d9040dcdc6");
	});

	it("geo-source get extracted from url query parameter case insensitive", function() {
		expect(prob.extractGeoSource('/rgb?key=12&geoSource=4f51844f-8f29-45ab-820e-d4d9040dcdc6&format=png')).toEqual("4f51844f-8f29-45ab-820e-d4d9040dcdc6");
	});

	it("geo-source get extracted from url path", function() {
		expect(prob.extractGeoSource('api/v1/GeoSource/4f51844f-8f29-45ab-820e-d4d9040dcdc6/Specification')).toEqual("4f51844f-8f29-45ab-820e-d4d9040dcdc6");
	});

	it("geo-source get extracted from url path", function() {
		expect(prob.extractGeoSource('api/v1/geosource/4f51844f-8f29-45ab-820e-d4d9040dcdc6/Specification')).toEqual("4f51844f-8f29-45ab-820e-d4d9040dcdc6");
	});

	it("geometry get extracted from url path", function() {
		expect(prob.extractGeoSource('/api/v1/Geometry/Boolean547JA8whtAF4puybIlO11tk7TBZNapEOf1szOZqLdBo/Rhombus?key=0&size=244')).toEqual("Boolean547JA8whtAF4puybIlO11tk7TBZNapEOf1szOZqLdBo");
	});

	it("geometry get extracted from url path", function() {
		expect(prob.extractGeoSource('/api/v1/geometry/Boolean547JA8whtAF4puybIlO11tk7TBZNapEOf1szOZqLdBo/Rhombus?key=0&size=244')).toEqual("Boolean547JA8whtAF4puybIlO11tk7TBZNapEOf1szOZqLdBo");
	});
});