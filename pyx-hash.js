const md5 = require('md5');

function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

module.exports = function hash(str) {
	let hashStr = md5(str);
	let bytes = hexToBytes(hashStr);
	let result = (bytes[12]<<24) + (bytes[13]<<16) + (bytes[14]<<8) + bytes[15];
	return result;
}