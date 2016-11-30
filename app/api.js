



Api.prototype.sendResponse = function(result, res) {

	res.send(JSON.stringify(result));

};